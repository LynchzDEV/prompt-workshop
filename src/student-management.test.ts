import { describe, it, expect, beforeEach, vi } from "vitest";
import { StudentManager, Student, Course } from "./student-management";

describe("Student Management System Tests", () => {
  let manager: StudentManager;

  beforeEach(() => {
    manager = new StudentManager();
  });

  const student1: Student = {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    grades: [85, 92, 78],
    isActive: true,
  };

  const student2: Student = {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    grades: [45, 50, 35],
    isActive: true,
  };

  const student3: Student = {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    grades: [],
    isActive: false,
  };

  describe("BUG 1: addStudent should return void", () => {
    it("addStudent should return void, not boolean", () => {
      const result = manager.addStudent(student1);
      expect(result).toBeUndefined();
    });
  });

  describe("BUG 2: getStudentById should handle undefined properly", () => {
    it("should find existing student", () => {
      manager.addStudent(student1);
      const found = manager.getStudentById(1);
      expect(found).toBeDefined();
      expect(found?.name).toBe("Alice Johnson");
    });

    it("should return undefined for non-existent student", () => {
      const notFound = manager.getStudentById(999);
      expect(notFound).toBeUndefined();
    });
  });

  describe("BUG 3: removeStudent should return correct boolean values", () => {
    it("should return true when student is successfully removed", () => {
      manager.addStudent(student1);
      const result = manager.removeStudent(1);
      expect(result).toBe(true);
    });

    it("should return false when student does not exist", () => {
      const result = manager.removeStudent(999);
      expect(result).toBe(false);
    });
  });

  describe("BUG 4: deactivateFailingStudents should handle all failing students", () => {
    it("should deactivate all failing students without skipping any", () => {
      const failing1 = {
        id: 10,
        name: "Fail1",
        email: "f1@test.com",
        grades: [30, 40],
        isActive: true,
      };
      const failing2 = {
        id: 11,
        name: "Fail2",
        email: "f2@test.com",
        grades: [35, 45],
        isActive: true,
      };
      const failing3 = {
        id: 12,
        name: "Fail3",
        email: "f3@test.com",
        grades: [25, 35],
        isActive: true,
      };

      manager.addStudent(failing1);
      manager.addStudent(failing2);
      manager.addStudent(failing3);

      manager.deactivateFailingStudents();

      const remainingActive = manager.getActiveStudents();
      expect(remainingActive.length).toBe(0);
    });
  });

  describe("BUG 5: calculateAverageGrade should handle empty arrays", () => {
    it("should return 0 for empty grade array", () => {
      const average = manager.calculateAverageGrade([]);
      expect(average).toBe(0);
    });

    it("should calculate correct average for normal arrays", () => {
      const average = manager.calculateAverageGrade([80, 90, 70]);
      expect(average).toBe(80);
    });
  });

  describe("BUG 6: getActiveStudents should return Student objects", () => {
    it("should return array of Student objects, not booleans", () => {
      manager.addStudent(student1);
      const activeStudents = manager.getActiveStudents();

      expect(activeStudents).toHaveLength(1);
      expect(typeof activeStudents[0]).toBe("object");
      expect(activeStudents[0]).toHaveProperty("name");
      expect(activeStudents[0]).toHaveProperty("id");
      expect(activeStudents[0]).toHaveProperty("email");
    });
  });

  describe("BUG 7: getCourseStudentCount should handle non-existent courses", () => {
    it("should return 0 for non-existent course without throwing error", () => {
      expect(() => {
        const count = manager.getCourseStudentCount(999);
        expect(count).toBe(0);
      }).not.toThrow();
    });
  });

  describe("BUG 8: loadStudentsFromAPI should properly await response.json()", () => {
    it("should properly handle async response.json()", async () => {
      const mockStudents = [student1, student2];
      const mockFetch = vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(mockStudents),
      });
      vi.stubGlobal("fetch", mockFetch);

      const result = await manager.loadStudentsFromAPI();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual(mockStudents);

      vi.unstubAllGlobals();
    });
  });

  describe("BUG 9: updateStudentGrades should properly convert string grades", () => {
    it("should convert string numbers to actual numbers and filter invalid grades", () => {
      const testStudent = { grades: [80, 90] };
      const mixedGrades = ["85", 92, "invalid", 78, "105", -5];

      const result = manager.updateStudentGrades(testStudent, mixedGrades);

      const allNumbers = result.grades.every(
        (grade) => typeof grade === "number",
      );
      expect(allNumbers).toBe(true);

      expect(result.grades).toEqual([85, 92, 78]);
    });
  });

  describe("BUG 10: generateStudentReports should handle Promise.all errors", () => {
    it("should handle students with no courses gracefully", async () => {
      manager.addStudent(student1);

      const reports = await manager.generateStudentReports();

      expect(Array.isArray(reports)).toBe(true);
      expect(reports.length).toBeGreaterThan(0);
    });
  });
});
