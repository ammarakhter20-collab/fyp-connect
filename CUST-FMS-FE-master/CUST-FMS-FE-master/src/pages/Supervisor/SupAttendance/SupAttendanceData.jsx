let index = 1;

const groupData = [
  {
    "groupNo": 1,
    "fypTitle": "Sample FYP Title 1",
    "SuprvisionRequest": "6-12-2024",
    "members": [
      {
        "Name": "John Doe",
        "RegistrationNo": "123456",
        "Percentage": "90%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Jane Doe",
        "RegistrationNo": "654321",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Alice Smith",
        "RegistrationNo": "987654",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "Spring 2024",
    "status": "Completed",
    "attendance": "Present",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Final 1",
    "status1": "pending",
    "Meetings": "06",
    "Course": "FYP Design Part-1",
    "supervisor": "Mudassar Adeel",
    "downloadLink": "pdf/bill.pdf",

  },
  {
    "groupNo": 2,
    "fypTitle": "Sample FYP Title 2",
    "SuprvisionRequest": "5-12-2024",
    "members": [
      {
        "Name": "John Doe",
        "RegistrationNo": "123456",
        "Percentage": "90%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Jane Doe",
        "RegistrationNo": "654321",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Alice Smith",
        "RegistrationNo": "987654",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "Fall 2023",
    "status": "In Progress",
    "attendance": "Absent",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Final 2",
    "status1": "pending",
    "Meetings": "09",
    "Course": "FYP Design Part-1",
    "supervisor": "Mudassar Adeel",
    "downloadLink": "pdf/bill.pdf",

  },
  {
    "groupNo": 3,
    "fypTitle": "Sample FYP Title 3",
    "SuprvisionRequest": "7-12-2024",
    "members": [
      {
        "Name": "John Doe",
        "RegistrationNo": "123456",
        "Percentage": "90%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Jane Doe",
        "RegistrationNo": "654321",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Alice Smith",
        "RegistrationNo": "987654",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "Spring 2023",
    "status": "Not Started",
    "attendance": "Present",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Proposal",
    "status1": "pending",
    "Meetings": "07",
    "Course": "FYP Design Part-1",
    "supervisor": "Mudassar Adeel",
    "downloadLink": "pdf/bill.pdf",

  },
  {
    "groupNo": 4,
    "fypTitle": "CUST FYP Management System",
    "SuprvisionRequest": "6-12-2024",
    "members": [
      {
        "Name": "Manan",
        "RegistrationNo": "BSE203134",
        "Percentage": "100%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Noor-ul-Huda",
        "RegistrationNo": "BSE203136",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", ""] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", ""] },
          // More days...
        ]
      },
      {
        "Name": "Abdullah",
        "RegistrationNo": "BSE203128",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "203",
    "status": "Part-1",
    "attendance": "Absent",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Mid 1",
    "status1": "pending",
    "Meetings": "09",
    "Course": "FYP Design Part-1",
    "supervisor": "Mr. Mudassar Adeel",
    "downloadLink": "pdf/bill.pdf",

  },

];




// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA
// EXAM GROUP DATA



const examGroupData = [
  {
    "groupNo": 1,
    "downloadLink": "pdf/bill.pdf",
    "fypTitle": "Sample FYP Title 1",
    "technology": "React",
    "platform": "Mobile Application",
    "category": "MIS",
    "termstatus": "Part 1",
    "SuprvisionRequest": "6-12-2024",
    "panelcode": "PC-004",
    "panel": [{
      "name": "Mudassar Adeel",
      "designation": "Sr. Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Qaisar Manzoor",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Ahtesham",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Panel Head",
    }, {
      "name": "Laiba Pasha",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",

    },
    ],
    "members": [
      {
        "Name": "John Doe",
        "RegistrationNo": "123456",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "90%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Jane Doe",
        "RegistrationNo": "654321",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Alice Smith",
        "RegistrationNo": "987654",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "Spring 2024",
    "status": "Completed",
    "attendance": "Present",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Final 1",
    "status1": "approved",
    "Meetings": "06",
    "Course": "FYP Design Part-1",
    "supervisor": "Laiba Sadiq",
    "fileupload": "34/5/23",
    "file": "file56.pdf",
    "fileuploadedby": 1,
  },
  {
    "groupNo": 2,
    "downloadLink": "pdf/bill.pdf",
    "fypTitle": "Sample FYP Title 2",
    "technology": "Flutter",
    "platform": "Mobile Application",
    "category": "IOT",
    "termstatus": "Part 2",
    "SuprvisionRequest": "6-12-2024",
    "panelcode": "PC-005",
    "panel": [{
      "name": "Mudassar Adeel",
      "designation": "Sr. Lecturer",
      "department": "Software Engneering",
      "role": "Panel Head",
    }, {
      "name": "Qaisar Manzoor",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Ahtesham",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Laiba Pasha",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    },
    ],
    "members": [
      {
        "Name": "John Doe",
        "RegistrationNo": "123456",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "90%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Jane Doe",
        "RegistrationNo": "654321",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Alice Smith",
        "RegistrationNo": "987654",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "Fall 2023",
    "status": "In Progress",
    "attendance": "Absent",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Final 2",
    "status1": "pending",
    "Meetings": "09",
    "Course": "FYP Design Part-1",
    "supervisor": "Maria Fatima",
    "fileupload": "34/6/26",
    "file": "file3.pdf",
    "fileuploadedby": 1,
  },
  {
    "groupNo": 3,
    "downloadLink": "pdf/bill.pdf",

    "fypTitle": "Sample FYP Title 3",
    "SuprvisionRequest": "6-12-2024",
    "platform": "Mobile Application",
    "category": "MIS",
    "termstatus": "Part 1",
    "panelcode": "PC-006",
    "panel": [{
      "name": "Mudassar Adeel",
      "designation": "Sr. Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Qaisar Manzoor",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Ahtesham",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Laiba Pasha",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Panel Head",
    },
    ],
    "technology": "React",
    "members": [
      {
        "Name": "John Doe",
        "RegistrationNo": "123456",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "90%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Jane Doe",
        "RegistrationNo": "654321",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Alice Smith",
        "RegistrationNo": "987654",
        "cgpa": "2.9",
        "credithrs": "130",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "Spring 2023",
    "status": "Not Started",
    "attendance": "Present",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Proposal",
    "status1": "rejected",
    "Meetings": "07",
    "Course": "FYP Design Part-1",
    "supervisor": "Qaisar Manzoor",
    "fileupload": "34/5/76",
    "file": "file2.pdf",
    "fileuploadedby": 1,
  },
  {
    "groupNo": 4,
    "downloadLink": "pdf/bill.pdf",
    "fypTitle": "CUST FYP Management System",
    "platform": "Web Application",
    "category": "MIS",
    "termstatus": "Part 1",
    "technology": "React",
    "SuprvisionRequest": "6-12-2024",
    "panelcode": "PC-001",
    "panel": [{
      "name": "Mudassar Adeel",
      "designation": "Sr. Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Qaisar Manzoor",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Examiner",
    }, {
      "name": "Ahtesham",
      "designation": "Lecturer",
      "department": "Software Engneering",
      "role": "Panel Head",
    },
    ],
    "members": [
      {
        "Name": "Manan",
        "RegistrationNo": "BSE203134",
        "credithrs": "130",
        "cgpa": "3.6",
        "Percentage": "100%",
        "Details": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      },
      {
        "Name": "Noor-ul-Huda",
        "RegistrationNo": "BSE203136",
        "credithrs": "130",
        "cgpa": "3.15",
        "Percentage": "85%",
        "Details": "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Present", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", ""] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", ""] },
          // More days...
        ]
      },
      {
        "Name": "Abdullah",
        "RegistrationNo": "BSE203128",
        "credithrs": "130",
        "cgpa": "2.9",
        "Percentage": "95%",
        "Details": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        "Meeting": [
          { "meetingno": 1, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 2, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 3, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 4, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 5, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 6, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 7, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 8, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
          { "meetingno": 9, "attendance": "Absent", "date": "27/08/2021", "slot": "0100-1300" },
        ],
        "WeeklyTimetable": [
          { "day": "Monday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "FREE", "IDS"] },
          { "day": "Tuesday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Wednesday", "slots": ["DLD", "FREE", "FREE", "FM", "OOP", "FA", "ITP", "SRE", "FREE"] },
          { "day": "Thursday", "slots": ["FM", "OOP", "FA", "ITP", "FREE", "FREE", "FREE", "SE", "SRE"] },
          { "day": "Friday", "slots": ["DS", "DLD", "FREE", "FREE", "SPM", "BPE", "FREE", "", "IDS"] },
          // More days...
        ]
      }
    ],
    "term": "203",
    "status": "Part-1",
    "attendance": "Absent",
    "Program": "BS Software Engineering",
    "Examdate": "27/08/2024",
    "Examtype": "Mid 1",
    "status1": "pending",
    "Meetings": "09",
    "Course": "FYP Design Part-1",
    "supervisor": "Mr. Mudassar Adeel",
    "fileupload": "34/5/76",
    "file": "file.pdf",
    "fileuploadedby": 2,


  },
];
const OrientationEvaluationData = {
  regno: 'BSE203134',
  name: 'Manan Shahid Bhatti',
  percentage: '5',
};


const sampleRemarksData = [
  {
    examiner: "Name 1",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 2",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 3",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 4",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },

  // Add more remarks for additional examiners
];
const proposalEvaluationData = {
  regno: 'BSE203134',
  name: 'Manan Shahid Bhatti',
  Q1: 7,
  Q2: 8,
  Q3: 9,
  Q4: 9,
  Q5: 9,
  Q6: 10,
  percentage: 8,

};


const proposalRemarksData = [
  {
    imagePath: "/assets/images/CardImg.png",
    examiner: "Mudassar Adeel Ahmed",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    imagePath: "/assets/images/freeslotsback.png",
    examiner: "Qaisar Manzoor",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    imagePath: "/assets/images/CardImg.png",
    examiner: "Dr. Ahtsham",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    imagePath: "/assets/images/freeslotsback.png",
    examiner: "Name",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },

];

const TaskIData = [
  {
    tasktitle: 'Proposal Formatting',
    percentage: '9'
  },
  {
    tasktitle: 'Figma Design',
    percentage: '10'
  },
  {
    tasktitle: 'Student Module Implementation',
    percentage: '5'
  },
  {
    tasktitle: 'Supervisor Module Implementation',
    percentage: '6'
  },


];

const midEvaluationData = {
  regno: "BSE203134",
  name: "Manan Shahid Bhatti",
  Q1: 8,
  Q2: 9,
  Q3: 9,
  Q4: 0,
  percentage: 17,
};
const midIIEvaluationData = {
  regno: "BSE203134",
  name: "Manan Shahid Bhatti",
  Q1: 8,
  Q2: 9,
  Q3: 9,
  Q4: 0,
  percentage: 27,
};


const midRemarksData = [
  {
    examiner: "Name 4",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 6",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 3",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 9",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  // Add more remarks for additional examiners
];

const finalEvaluationData = {
  regno: "BSE203134",
  name: "Manan Shahid Bhatti",
  Q1: 8,
  Q2: 9,
  Q3: 9,
  percentage: 45,
};


const finalRemarksData = [
  {
    examiner: "Name 8",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 86",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 38",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 98",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 98",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    examiner: "Name 98",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  }, {
    examiner: "Name 98",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  }, {
    examiner: "Name 98",
    remarks: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },

  // Add more remarks for additional examiners
];
const overallEvaluationDataP1 = {
  regno: "BSE203134",
  name: "Manan Shahid Bhatti",
  orientation: 5,
  proposal: 8,
  attendance: 12,
  task: 8,
  mid: 17,
  final: 45,
  percentage: 90,

};
const overallEvaluationDataP2 = {
  regno: "BSE203134",
  name: "Manan Shahid Bhatti",
  attendance: 18,
  task: 8,
  mid: 27,
  final: 45,
  percentage: 90,

};

const OverAllData = {
  regno: "BSE203134",
  name: "Manan Shahid Bhatti",
  PartI: 85,
  PartII: 85,
  percentage: 85,

};

const ActiveData = {
  part1: [
    {
      groupNo: 1,
      fypTitle: 'FYP Title of Group 1',
    },
    {
      groupNo: 2,
      fypTitle: 'FYP Title of Group 2',
    },
  ],
  part2: [
    {
      groupNo: 1,
      fypTitle: 'FYP Title of Group 1',
    },
    {
      groupNo: 2,
      fypTitle: 'FYP Title of Group 2',
    },
  ]
}
const Announcements = [
  {title: 'Proposal',
  announcedby: 'Coordinator',
  date: new Date().toLocaleString(),
  acid: 'alid' + index++,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  downloadLink: "pdf/bill.pdf",

},
  {title: 'Result Anncuncement',
  announcedby: 'HOD',
  date: new Date().toLocaleString(),
  acid: 'alid' + index++,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  downloadLink: "pdf/bill.pdf",

},
  {title: 'Final Exam',
  announcedby: 'Coordinator',
  date: new Date().toLocaleString(),
  acid: 'alid' + index++,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  downloadLink: "pdf/bill.pdf",
},
  {title: 'Mid Exam',
  announcedby: 'Coordinator',
  date: new Date().toLocaleString(),
  acid: 'alid' + index++,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  downloadLink: "pdf/bill.pdf",

},
  {title: 'Proposal',
  announcedby: 'HOD',
  date: new Date().toLocaleString(),
  acid: 'alid' + index++,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  downloadLink: "pdf/bill.pdf",

},
]




export {

  groupData,
  examGroupData,
  OrientationEvaluationData,
  sampleRemarksData,
  proposalEvaluationData,
  proposalRemarksData,
  midEvaluationData,
  midIIEvaluationData,
  midRemarksData,
  finalEvaluationData,
  finalRemarksData,
  overallEvaluationDataP1, overallEvaluationDataP2, OverAllData, ActiveData, Announcements,

};
