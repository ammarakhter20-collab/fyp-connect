import React, { useState, useEffect } from 'react';
import { initFlowbite } from 'flowbite';
import Select from 'react-select';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';

const CoodAssignPanel = () => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [termData, setTermData] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [groups, setGroups] = useState([]);
  const [panelOptions, setPanelOptions] = useState([]);
  const [assigningGroupId, setAssigningGroupId] = useState(null);
  const [selectedPanelForAssign, setSelectedPanelForAssign] = useState(null);

  useEffect(() => {
    initFlowbite();
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'CoodAssignPanel';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) {
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
  }, []);

  // Fetch term data on mount
  useEffect(() => {
    fetchTermData();
  }, []);

  const fetchTermData = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/auth/getTermdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Term Data');
      }
      const data = await response.json();
      const activeTerms = data.fypTerms.filter(term => term.status === 'activated');
      const dataofterm = activeTerms.map((term) => ({
        ...term,
        label: term.sessionTerm,
        value: term._id,
      }));
      setTermData(dataofterm);
    } catch (error) {
      console.error('Error fetching Term Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  // Fetch groups when term changes
  const fetchGroupsForTerm = async (termId) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/manageexampanels/groups-for-panel-assignment?termId=${termId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data.groups || []);
      setPanelOptions(data.panels || []);
    } catch (error) {
      console.error('Error fetching groups:', error.message);
      setGroups([]);
      setPanelOptions([]);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleTermChange = (selectedOption) => {
    setSelectedTerm(selectedOption);
    setAssigningGroupId(null);
    setSelectedPanelForAssign(null);
    if (selectedOption) {
      fetchGroupsForTerm(selectedOption.value);
    } else {
      setGroups([]);
      setPanelOptions([]);
    }
  };

  const handleAssignPanel = async (groupId, panelId) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/manageexampanels/assign-panel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ panelId, registrationId: groupId }),
      });
      if (response.ok) {
        alert('Panel assigned successfully!');
        setAssigningGroupId(null);
        setSelectedPanelForAssign(null);
        // Refresh data
        fetchGroupsForTerm(selectedTerm.value);
      } else {
        const errData = await response.json();
        alert('Failed to assign panel: ' + (errData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error assigning panel:', error);
      alert('Error assigning panel');
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleUnassignPanel = async (groupId) => {
    if (!window.confirm('Are you sure you want to remove the panel assignment from this group?')) return;
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const response = await fetch(`/api/manageexampanels/unassign-panel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ registrationId: groupId }),
      });
      if (response.ok) {
        alert('Panel removed successfully!');
        fetchGroupsForTerm(selectedTerm.value);
      } else {
        alert('Failed to remove panel');
      }
    } catch (error) {
      console.error('Error unassigning panel:', error);
      alert('Error removing panel');
    } finally {
      setLoadingSpinner(false);
    }
  };

  const panelSelectOptions = panelOptions.map(p => ({
    value: p.panelId,
    label: `${p.panelName} (${p.members.join(', ')})`,
  }));

  return (
    <>
      {loadingSpinner ? (
        <LoadingSpinner />
      ) : (
        <div className='bg-slate-100 w-full min-h-screen'>
          <div className="mx-10 pt-12 flex flex-col gap-5">

            {/* Header Card */}
            <div className="bg-primary text-white rounded-xl shadow-md px-6 py-4">
              <h2 className="text-xl font-bold">Assign Panel to Groups</h2>
              <p className="text-sm text-gray-200 mt-1">Select a term and assign examiner panels to each FYP group individually</p>
            </div>

            {/* Term Selector */}
            <div className="bg-white rounded-xl shadow-md px-6 py-4">
              <label className="block text-md font-semibold text-gray-700 mb-2">Select Term</label>
              <Select
                options={termData}
                onChange={handleTermChange}
                value={selectedTerm}
                placeholder="Select a term..."
                isClearable
                className="w-full md:w-1/3"
              />
            </div>

            {/* Groups Table */}
            {selectedTerm && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-white uppercase bg-primary">
                      <tr>
                        <th className="px-4 py-3">SR NO.</th>
                        <th className="px-4 py-3">PROJECT NAME</th>
                        <th className="px-4 py-3">SUPERVISOR</th>
                        <th className="px-4 py-3">MEMBERS</th>
                        <th className="px-4 py-3">ASSIGNED PANEL</th>
                        <th className="px-4 py-3 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-gray-400 font-medium">
                            No approved groups found for this term
                          </td>
                        </tr>
                      ) : (
                        groups.map((group, index) => (
                          <tr key={group.groupId} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-indigo-700">{index + 1}</td>
                            <td className="px-4 py-3 font-medium">{group.topicName}</td>
                            <td className="px-4 py-3">{group.supervisorName}</td>
                            <td className="px-4 py-3">{group.memberCount}</td>
                            <td className="px-4 py-3">
                              {group.currentPanel ? (
                                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                                  {group.currentPanel.panelName}
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                                  Not Assigned
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-center">
                              {assigningGroupId === group.groupId ? (
                                <div className="flex items-center gap-2 justify-center">
                                  <Select
                                    options={panelSelectOptions}
                                    onChange={(opt) => setSelectedPanelForAssign(opt)}
                                    value={selectedPanelForAssign}
                                    placeholder="Pick panel..."
                                    className="w-64 text-left text-xs"
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                  />
                                  <button
                                    onClick={() => {
                                      if (selectedPanelForAssign) {
                                        handleAssignPanel(group.groupId, selectedPanelForAssign.value);
                                      } else {
                                        alert('Please select a panel first');
                                      }
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => { setAssigningGroupId(null); setSelectedPanelForAssign(null); }}
                                    className="bg-gray-400 hover:bg-gray-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 justify-center">
                                  <button
                                    onClick={() => {
                                      setAssigningGroupId(group.groupId);
                                      setSelectedPanelForAssign(
                                        group.currentPanel
                                          ? panelSelectOptions.find(o => o.value === group.currentPanel.panelId) || null
                                          : null
                                      );
                                    }}
                                    className="bg-primary hover:bg-indigo-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                  >
                                    {group.currentPanel ? 'Change' : 'Assign'}
                                  </button>
                                  {group.currentPanel && (
                                    <button
                                      onClick={() => handleUnassignPanel(group.groupId)}
                                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Footer */}
                {groups.length > 0 && (
                  <div className="px-6 py-3 bg-gray-50 border-t text-sm text-gray-600 flex justify-between">
                    <span>Total Groups: <strong>{groups.length}</strong></span>
                    <span>
                      Assigned: <strong className="text-green-600">{groups.filter(g => g.currentPanel).length}</strong>
                      {' | '}
                      Unassigned: <strong className="text-red-500">{groups.filter(g => !g.currentPanel).length}</strong>
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};

export default CoodAssignPanel;
