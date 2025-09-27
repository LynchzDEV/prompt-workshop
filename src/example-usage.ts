// Example usage that will trigger the bugs
import { StudentManager, Student, Course } from "./student-management";

const manager = new StudentManager();

const student1: Student = {
  id: 1,
  name: "Alice Johnson",
  email: "alice@example.com",
  grades: [85, 92, 78],
  isActive: true
};

const student2: Student = {
  id: 2,
  name: "Bob Smith",
  email: "bob@example.com",
  grades: [],
  isActive: true
};

// These calls will demonstrate the bugs
manager.addStudent(student1);
const retrievedStudent = manager.getStudentById(999);
console.log(retrievedStudent.name);

manager.removeStudent(1);
manager.deactivateFailingStudents();

const average = manager.calculateAverageGrade([]);
console.log(`Average: ${average}`);

const activeStudents = manager.getActiveStudents();
console.log(activeStudents);
