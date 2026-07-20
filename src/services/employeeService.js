// Mock API layer. Simulates async network calls using setTimeout so the UI
// can show loading states. Data is persisted in localStorage so CRUD changes
// survive a refresh.

import { employees as seedData } from "./mockData";

const STORAGE_KEY = "employees_data";
const DELAY = 600; // fake network delay in ms

// load from localStorage, fall back to seed data on first run
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  return seedData;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// small helper to fake a network request
function fakeRequest(callback) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback());
      } catch (err) {
        reject(err);
      }
    }, DELAY);
  });
}

export const employeeService = {
  getAll() {
    return fakeRequest(() => loadData());
  },

  getById(id) {
    return fakeRequest(() => {
      const data = loadData();
      const found = data.find((e) => e.id === id);
      if (!found) {
        throw new Error("Employee not found");
      }
      return found;
    });
  },

  create(employee) {
    return fakeRequest(() => {
      const data = loadData();
      const newEmployee = {
        ...employee,
        id: Date.now().toString(),
      };
      const updated = [newEmployee, ...data];
      saveData(updated);
      return newEmployee;
    });
  },

  update(id, employee) {
    return fakeRequest(() => {
      const data = loadData();
      const index = data.findIndex((e) => e.id === id);
      if (index === -1) {
        throw new Error("Employee not found");
      }
      data[index] = { ...data[index], ...employee, id };
      saveData(data);
      return data[index];
    });
  },

  remove(id) {
    return fakeRequest(() => {
      const data = loadData();
      const updated = data.filter((e) => e.id !== id);
      saveData(updated);
      return { success: true };
    });
  },
};
