import React, { useEffect, useState } from 'react';
import SupervisionRequest from './SupervisionRequest';
import { initFlowbite } from 'flowbite';
import SupViewRequestDetails from './SupViewRequestDetails';
import SupDenialFeedBack from './SupDenialFeedBack';
import Success from '../../../Components/Banners/Success';
import SupFYPChangeReq from './SupFYPChangeReq';
import SupFYPChangeReqDetails from './SupFYPChangeReqDetails';
import SupUpdatedProject from './SupUpdatedProject';
import LoadingSpinner from '../../../Components/LoadingSpinner/LoadingSpinner';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import GenAccor from '../../../Components/Accordians/GenAccor';


const SupRequest = () => {

  const [showRequestTable, setShowRequestTable] = useState(true);

  const [showFYPChangeReq, setshowFYPChangeReq] = useState(true);

  const [showUpdatedProjDet, setShowUpdatedProjDet] = useState(false);

  const [showFYPChangeReqDetails, setshowFYPChangeReqDetails] = useState(false);

  const [showRequestDetails, setShowRequestDeails] = useState(false);

  const [isSupSelectedGroup, setIsSupSelectedGroup] = useState(null);

  const [isUpdatedGroupData, setIsUpdatedGroupData] = useState([]);

  const [isFYPChangeSelectedGroup, setIsFYPChangeSelectedGroup] = useState(null);

  const [showFeedback, setShowFeedback] = useState(false);

  const [isSupervisionApproved, setIsSupervisionApproved] = useState(false);

  const [loadingSpinner, setLoadingSpinner] = useState(false);

  const [supRequests, setSupRequests] = useState(null);

  const [reqStatus, setReqStatus] = useState('pending');

  const [requestid, setRequestId] = useState(null);

  const [fypChangeRequests, setFypChangeRequests] = useState(null);

  // Topic & Tech change request states
  const [topicChangeRequests, setTopicChangeRequests] = useState([]);
  const [showTopicChangeSection, setShowTopicChangeSection] = useState(true);
  const [selectedTopicReq, setSelectedTopicReq] = useState(null);
  const [showTopicReqDetails, setShowTopicReqDetails] = useState(false);
  const [topicActionSuccess, setTopicActionSuccess] = useState('');


  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const groupId = params.get('id');
  const supId = params.get('supid');
  console.log(groupId, "Gid")

  useEffect(() => {
    initFlowbite();
    // Update the selected tab when the component mounts
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
      const tabName = 'SupRequest';
      const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
      if (selectedTab) {
        const topOffset = selectedTab.offsetTop;
        indicator.style.top = `${topOffset}px`;
      }
    }
  }, []);

  useEffect(() => {
    if (isSupervisionApproved) {
      const timer = setTimeout(() => {
        setIsSupervisionApproved(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupervisionApproved]);

  useEffect(() => {
    if (topicActionSuccess) {
      const timer = setTimeout(() => {
        setTopicActionSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [topicActionSuccess]);

  const fetchRequests = async () => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;

      const response = await fetch(`/api/fyp/fyprequests/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Data');
      }
      const data = await response.json();
      setSupRequests(data);
      console.log("Supervision requests fetched:", data);

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const fetchChangeRequests = async () => {
    try {
      setLoadingSpinner(true);
      const token = localStorage.getItem('key');

      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;
      console.log("User Id pass to check fyp change request", userId);
      const response = await fetch(`/api/fyp/fyp-change-requests/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Data');
      }
      const data = await response.json();
      console.log("Change requests data:", data);
      setFypChangeRequests(data);

    } catch (error) {
      console.error('Error fetching Data:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };

  // Fetch topic change requests for supervisor
  const fetchTopicChangeRequests = async () => {
    try {
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);
      const userData = localStorage.getItem('user');
      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;

      const response = await axios.get(`/api/fyp/topicChangeReqsForSupervisor/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Topic change requests fetched:", response.data);
      setTopicChangeRequests(response.data);
    } catch (error) {
      console.error('Error fetching topic change requests:', error.message);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchChangeRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTopicChangeRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewClick = (id) => {
    const selectedGroup = supRequests.fypRequests.find(group => group._id === id);
    const newid = selectedGroup._id
    setRequestId(newid);
    setIsSupSelectedGroup(selectedGroup);
    setShowRequestTable(false);
    setshowFYPChangeReq(false);
    setShowTopicChangeSection(false);
    setShowRequestDeails(true);
  }

  const handleFeedbackClose = () => {
    setShowFeedback(false);
  }
  const handleFeedbackClick = (feedback) => {
    updateFypRequestStatus(reqStatus, requestid, feedback);
    handleFeedbackClose();
  };


  const updateFypRequestStatus = async (reqStatus, requestid, reqFeedback) => {
    try {
      const token = localStorage.getItem('key');
      console.log(token)
      const response = await fetch(`/api/fyp/updatestatus/${requestid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reqStatus, reqFeedback }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      console.log('Updated request:', data.updatedRequest);
    } catch (error) {
      console.error('Error updating request status:', error.message);
    } finally {
      setLoadingSpinner(false);
    }
  };


  const handleApprovalClick = (index) => {
    const newStatus = 'approved';
    setReqStatus(newStatus);
    setIsSupervisionApproved(true);
    updateFypRequestStatus(newStatus, requestid);
  };

  const handlePartialDenyClick = (index) => {
    const newStatus = 'partial-deny';
    setReqStatus(newStatus);
    setShowFeedback(true);
  };

  const handleDenialClick = (index) => {
    const newStatus = 'rejected';
    setReqStatus(newStatus);
    setShowFeedback(true);
  };

  const viewDetailsClickFYPChange = (id) => {
    console.log(fypChangeRequests, "Requests for change")
    const selectedGroup = fypChangeRequests.filteredChangeRequests.find(group => group.fypGroup._id === id);
    console.log('selectted group change check', selectedGroup);

    if (selectedGroup) {
      const selecteddata = {
        _id: selectedGroup.fypGroup._id,
        fypTitle: selectedGroup.fypGroup.topicData.topic,
        category: selectedGroup.fypGroup.topicData.category,
        platform: selectedGroup.fypGroup.selectedPlatform.platformName,
        technology: selectedGroup.fypGroup.selectedTechnology.techName,
        term: selectedGroup.term,
        supervisor: selectedGroup.fypGroup.selectedOption.name,
        description: selectedGroup.fypGroup.topicData.description,
        newTopic: selectedGroup.changeData.topic,
        newTechnology: selectedGroup.changeData.technology,
        newPlatform: selectedGroup.changeData.platform,
        newCategory: selectedGroup.changeData.category,
        newDescription: selectedGroup.changeData.desc,
        changeReq: selectedGroup.changeReq,
      }
      console.log('selected data', selecteddata)
      setIsFYPChangeSelectedGroup(selecteddata);
      setshowFYPChangeReqDetails(true);
      setshowFYPChangeReq(false);
      setShowRequestTable(false);
      setShowTopicChangeSection(false);
    }
  }

  useEffect(() => {
    if (groupId && fypChangeRequests) {
      viewDetailsClickFYPChange(groupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (supId && supRequests) {
      handleViewClick(supId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleEditDetailsFYPChange = (updateddata) => {
    const newdata = [{
      fypTitle: updateddata.fypTitle,
      technology: updateddata.technology,
      term: isFYPChangeSelectedGroup.term,
      platform: isFYPChangeSelectedGroup.platform,
      supervisor: isFYPChangeSelectedGroup.supervisor,
      category: isFYPChangeSelectedGroup.category,
    }];

    setIsUpdatedGroupData(newdata);
    setShowUpdatedProjDet(true);
    setshowFYPChangeReqDetails(false);
  }

  const handleSimpleClickinUpdatedProjDet = (id) => {
    setShowUpdatedProjDet(false);
    console.log("yeh kya return kia", id)
    viewDetailsClickFYPChange(id);
    setshowFYPChangeReqDetails(true);
  }

  // Topic change request approve/reject handlers
  const handleApproveTopicReq = async (reqId) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await axios.patch(`/api/fyp/approveTopicRequest/${reqId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Topic request approved:", response.data);
      setTopicActionSuccess('Topic change request approved! Project topic has been updated.');
      setShowTopicReqDetails(false);
      setSelectedTopicReq(null);
      // Refresh the list
      fetchTopicChangeRequests();
    } catch (error) {
      console.error('Error approving topic request:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleRejectTopicReq = async (reqId) => {
    try {
      setLoadingSpinner(true);
      const nkey = localStorage.getItem('key');
      const token = JSON.parse(nkey);

      const response = await axios.patch(`/api/fyp/rejectTopicRequest/${reqId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Topic request rejected:", response.data);
      setTopicActionSuccess('Topic change request rejected.');
      setShowTopicReqDetails(false);
      setSelectedTopicReq(null);
      fetchTopicChangeRequests();
    } catch (error) {
      console.error('Error rejecting topic request:', error);
    } finally {
      setLoadingSpinner(false);
    }
  };

  const handleViewTopicReq = (req) => {
    setSelectedTopicReq(req);
    setShowTopicReqDetails(true);
    setShowRequestTable(false);
    setshowFYPChangeReq(false);
    setShowTopicChangeSection(false);
  };

  const handleGoBack = () => {
    setshowFYPChangeReq(true)
    setShowRequestTable(true)
    setShowRequestDeails(false)
    setshowFYPChangeReqDetails(false)
    setShowUpdatedProjDet(false)
    setShowFeedback(false)
    setIsSupervisionApproved(false)
    setShowTopicChangeSection(true)
    setShowTopicReqDetails(false)
    setSelectedTopicReq(null)
  }

  return (
    <>
      {loadingSpinner ? (
        <LoadingSpinner />
      ) : (
        <div className='bg-slate-100 w-full h-full'>
          <div className='mx-10 pt-12 flex flex-col gap-3 relative' >
            {(showRequestTable && supRequests) && (
              <div >
                <SupervisionRequest groupData={supRequests} viewButtonClick={handleViewClick} accordionId={1} />
              </div>
            )}
            {showRequestDetails && (
              <div className='relative top-0 left-0 w-full h-full flex justify-center items-center '>
                <SupViewRequestDetails Data={isSupSelectedGroup} accordionId={2} handleApproval={handleApprovalClick} handlePartialDeny={handlePartialDenyClick} handleDenial={handleDenialClick} handleGoBack={handleGoBack} />
              </div>
            )}
            {showFYPChangeReq && fypChangeRequests && (
              <div >
                <SupFYPChangeReq groupData={fypChangeRequests} accordionId={3} viewDetailsClickFYPChange={viewDetailsClickFYPChange} />
              </div>
            )}

            {/* Topic/Tech Change Requests Section */}
            {showTopicChangeSection && (
              <div>
                <div id={`accordion-collapse-topic-change`} data-accordion="collapse" className='mt-1'>
                  <GenAccor accordionId={'topic-change'} text={'Topic Change Requests'} />
                  <div id={`accordion-collapse-body-timetable-topic-change`} className="hidden" aria-labelledby={`accordion-collapse-heading-timetable-topic-change`}>
                    {topicChangeRequests && topicChangeRequests.length > 0 ? (
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg block w-full bg-white border border-gray-200 rounded-2xl">
                        <table className="w-full text-sm text-center text-gray-500">
                          <thead className="text-xs text-white uppercase bg-primary">
                            <tr>
                              <th scope="col" className="px-6 py-3">Serial No</th>
                              <th scope="col" className="px-6 py-3">Current Topic</th>
                              <th scope="col" className="px-6 py-3">New Topic</th>
                              <th scope="col" className="px-6 py-3">Requested By</th>
                              <th scope="col" className="px-6 py-3">Reason</th>
                              <th scope="col" className="px-6 py-3">Status</th>
                              <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topicChangeRequests.map((req, index) => (
                              <tr key={req._id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{req.fypTopic}</td>
                                <td className="px-6 py-4 font-medium text-indigo-700">{req.newFypTopic}</td>
                                <td className="px-6 py-4">{req.user?.name || 'N/A'}</td>
                                <td className="px-6 py-4 max-w-xs truncate">{req.reasonForChange}</td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${req.topicReqStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    req.topicReqStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                    {req.topicReqStatus}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {req.topicReqStatus === 'pending' ? (
                                    <button
                                      className="font-medium text-primary hover:underline"
                                      onClick={() => handleViewTopicReq(req)}
                                    >
                                      View
                                    </button>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="relative overflow-x-auto h-full shadow-md sm:rounded-lg block w-full p-6 bg-white border border-gray-200 rounded-2xl">
                        No Topic Change Requests
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Topic Change Request Details View */}
            {showTopicReqDetails && selectedTopicReq && (
              <div className='relative top-0 left-0 w-full h-full flex justify-center items-center'>
                <div className="bg-white shadow-md rounded-lg p-6 w-[100%] h-auto">
                  <h2 className="text-2xl font-bold text-indigo-950 mb-4">Topic Change Request Details</h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Current Topic</label>
                      <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium">{selectedTopicReq.fypTopic}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Requested New Topic</label>
                      <p className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 font-medium">{selectedTopicReq.newFypTopic}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Reason for Change</label>
                    <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">{selectedTopicReq.reasonForChange}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Requested By</label>
                      <p className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                        {selectedTopicReq.user?.name || 'N/A'} {selectedTopicReq.user?.registrationNumber ? `(${selectedTopicReq.user.registrationNumber})` : ''}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                      <p className={`p-3 rounded-lg font-semibold ${selectedTopicReq.topicReqStatus === 'pending' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                        selectedTopicReq.topicReqStatus === 'approved' ? 'bg-green-50 border border-green-200 text-green-800' :
                          'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                        {selectedTopicReq.topicReqStatus}
                      </p>
                    </div>
                  </div>

                  {selectedTopicReq.topicReqStatus === 'pending' && (
                    <div className='flex justify-end space-x-3 mt-6'>
                      <button
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        onClick={() => handleApproveTopicReq(selectedTopicReq._id)}
                      >
                        Approve & Update Topic
                      </button>
                      <button
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        onClick={() => handleRejectTopicReq(selectedTopicReq._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <div className='flex flex-row justify-end mt-5'>
                    <button
                      className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-indigo-800 transition-colors"
                      onClick={handleGoBack}
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showFYPChangeReqDetails && (
              <div className='relative top-0 left-0 w-full h-full flex justify-center items-center '>
                <SupFYPChangeReqDetails data={isFYPChangeSelectedGroup} handleEditDetailsFYPChange={handleEditDetailsFYPChange} handleGoBack={handleGoBack} />
              </div>
            )}
            {showFeedback && (
              <div className='fixed top-5 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30'>
                <SupDenialFeedBack onclose={handleFeedbackClose} addFeedbackClick={handleFeedbackClick} handleGoBack={handleGoBack} />
              </div>
            )}
            {showUpdatedProjDet && (
              <div >
                <SupUpdatedProject accordionId={4} groupData={isUpdatedGroupData} handleSimpleClick={handleSimpleClickinUpdatedProjDet} handleGoBack={handleGoBack} />
              </div>
            )}
            <div className='flex justify-center'>
              {isSupervisionApproved && (
                <div className='absolute top-24 w-[50%]'>
                  <Success
                    message={"FYP group approved successfully"}
                    bannerstyle={"bg-green-100 w-full h-full border text-center text-green-700 px-4 py-3 rounded-full"}
                    fontstyle={"block sm:inline font-bold"}
                  />
                </div>
              )}
              {topicActionSuccess && (
                <div className='absolute top-24 w-[50%]'>
                  <Success
                    message={topicActionSuccess}
                    bannerstyle={"bg-green-100 w-full h-full border text-center text-green-700 px-4 py-3 rounded-full"}
                    fontstyle={"block sm:inline font-bold"}
                  />
                </div>
              )}
            </div>

          </div>

        </div>
      )}
    </>
  );
};
export default SupRequest;
