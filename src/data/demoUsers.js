export const demoUsers = {
  employee: {
    name: "Clara Malatsi", role: "Employee", initials: "CM", department: "Information Technology",
    position: "Software Developer", employeeNumber: "CH-00124", email: "clara.malatsi@chimera.co.za",
    phone: "+27 00 000 0000", manager: "John Smith", joined: "06 January 2025", photo: null,
  },
  manager: {
    name: "John Smith", role: "Manager", initials: "JS", department: "Information Technology",
    position: "IT Manager", employeeNumber: "CH-00125", email: "john.smith@chimera.co.za",
    phone: "+27 00 000 0001", manager: "Mary Jones", joined: "14 March 2022", photo: null,
  },
  admin: {
    name: "Mary Jones", role: "Administrator", initials: "MJ", department: "Human Resources",
    position: "HR Administrator", employeeNumber: "CH-00126", email: "mary.jones@chimera.co.za",
    phone: "+27 00 000 0002", manager: "Executive Office", joined: "02 August 2021", photo: null,
  },
};

export const findDemoUserByEmail = (email) =>
  Object.values(demoUsers).find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
