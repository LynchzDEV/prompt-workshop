// Test suite to verify student fixes
// Run with: npm test

import { StudentManager, Student, Course } from "./student-management";

// Test utilities
function assertEqual<T>(actual: T, expected: T, testName: string): void {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`✅ ${testName}: PASSED`);
  } else {
    console.log(`❌ ${testName}: FAILED`);
    console.log(`   Expected: ${JSON.stringify(expected)}`);
    console.log(`   Actual: ${JSON.stringify(actual)}`);
  }
}

function assertType<T>(value: T, expectedType: string, testName: string): void {
  const actualType = typeof value;
  if (actualType === expectedType) {
    console.log(`✅ ${testName}: PASSED (type: ${actualType})`);
  } else {
    console.log(
      `❌ ${testName}: FAILED (expected: ${expectedType}, got: ${actualType})`,
    );
  }
}

function assertNotThrows(fn: () => any, testName: string): void {
  try {
    fn();
    console.log(`✅ ${testName}: PASSED (no error thrown)`);
  } catch (error) {
    console.log(`❌ ${testName}: FAILED (error thrown: ${error})`);
  }
}

async function runTests(): Promise<void> {
  console.log("🧪 Running TypeScript Bug Fix Tests\n");

  const manager = new StudentManager();

  // Test data
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

  console.log("=== BUG 1 TEST: addStudent return type ===");
  // Bug 1: Should return void, not boolean
  const addResult = manager.addStudent(student1);
  assertType(addResult, "undefined", "addStudent returns void");

  console.log("\n=== BUG 2 TEST: getStudentById null safety ===");
  // Bug 2: Should handle undefined return from find()
  manager.addStudent(student2);

  const foundStudent = manager.getStudentById(1);
  assertEqual(
    foundStudent?.name,
    "Alice Johnson",
    "getStudentById finds existing student",
  );

  const notFoundStudent = manager.getStudentById(999);
  assertEqual(
    notFoundStudent,
    undefined,
    "getStudentById returns undefined for non-existent student",
  );

  // This should not throw an error if properly fixed
  assertNotThrows(() => {
    const result = manager.getStudentById(999);
    // Safe access - should not crash
    console.log(`Student name: ${result?.name || "Not found"}`);
  }, "getStudentById handles non-existent student safely");

  console.log("\n=== BUG 3 TEST: removeStudent logic ===");
  // Bug 3: Should return true when successfully removed, false when not found
  const removeExisting = manager.removeStudent(1);
  assertEqual(
    removeExisting,
    true,
    "removeStudent returns true when student exists",
  );

  const removeNonExisting = manager.removeStudent(999);
  assertEqual(
    removeNonExisting,
    false,
    "removeStudent returns false when student does not exist",
  );

  console.log("\n=== BUG 4 TEST: deactivateFailingStudents array mutation ===");
  // Bug 4: Should properly handle array mutation during iteration
  manager.addStudent(student1); // Re-add after removal
  manager.addStudent(student2); // Failing student
  manager.addStudent(student3); // Empty grades

  assertNotThrows(() => {
    manager.deactivateFailingStudents();
  }, "deactivateFailingStudents does not crash during iteration");

  console.log("\n=== BUG 5 TEST: calculateAverageGrade edge cases ===");
  // Bug 5: Should handle empty arrays and return proper number
  const avgWithGrades = manager.calculateAverageGrade([80, 90, 70]);
  assertEqual(
    avgWithGrades,
    80,
    "calculateAverageGrade works with normal array",
  );

  const avgEmpty = manager.calculateAverageGrade([]);
  assertEqual(
    avgEmpty,
    0,
    "calculateAverageGrade handles empty array (should return 0)",
  );

  assertType(
    manager.calculateAverageGrade([85]),
    "number",
    "calculateAverageGrade returns number",
  );

  console.log("\n=== BUG 6 TEST: getActiveStudents return type ===");
  // Bug 6: Should return Student[], not boolean[]
  const activeStudents = manager.getActiveStudents();

  if (activeStudents.length > 0) {
    assertType(
      activeStudents[0],
      "object",
      "getActiveStudents returns Student objects",
    );
    // Check if first element has Student properties
    const hasStudentProps =
      activeStudents[0] &&
      "name" in activeStudents[0] &&
      "id" in activeStudents[0];
    assertEqual(
      hasStudentProps,
      true,
      "getActiveStudents returns proper Student objects",
    );
  }

  console.log("\n=== BUG 7 TEST: getCourseStudentCount null safety ===");
  // Bug 7: Should handle case when course is not found
  assertNotThrows(() => {
    const count = manager.getCourseStudentCount(999);
    assertEqual(
      count,
      0,
      "getCourseStudentCount returns 0 for non-existent course",
    );
  }, "getCourseStudentCount handles non-existent course");

  console.log("\n=== BUG 8 TEST: loadStudentsFromAPI Promise handling ===");
  // Bug 8: Should properly await response.json() and handle types
  // Mock fetch for testing
  (global as any).fetch = async () => ({
    json: async () => [student1, student2],
  });

  try {
    const students = await manager.loadStudentsFromAPI();
    assertType(students, "object", "loadStudentsFromAPI returns array");
    assertEqual(
      Array.isArray(students),
      true,
      "loadStudentsFromAPI returns array",
    );
    console.log("✅ loadStudentsFromAPI: PASSED (proper Promise handling)");
  } catch (error) {
    console.log("❌ loadStudentsFromAPI: FAILED (Promise handling issue)");
  }

  console.log("\n=== BUG 9 TEST: updateStudentGrades type conversion ===");
  // Bug 9: Should properly filter and convert string/number grades
  const testStudent = { grades: [80, 90] };
  const mixedGrades = ["85", 92, "invalid", 78, "105", -5];

  assertNotThrows(() => {
    const result = manager.updateStudentGrades(testStudent, mixedGrades);
    // Should filter out invalid grades and convert strings to numbers
    const validGrades = result.grades.filter(
      (grade: any) => typeof grade === "number" && grade >= 0 && grade <= 100,
    );
    assertEqual(
      validGrades.length > 0,
      true,
      "updateStudentGrades filters invalid grades",
    );
  }, "updateStudentGrades handles mixed grade types");

  console.log(
    "\n=== BUG 10 TEST: generateStudentReports Promise.all error handling ===",
  );
  // Bug 10: Should handle Promise.all with potential rejections
  try {
    const reports = await manager.generateStudentReports();
    assertType(reports, "object", "generateStudentReports returns array");
    assertEqual(
      Array.isArray(reports),
      true,
      "generateStudentReports returns string array",
    );
    console.log(
      "✅ generateStudentReports: PASSED (handles Promise.all correctly)",
    );
  } catch (error) {
    console.log(
      `❌ generateStudentReports: FAILED (Promise.all error handling issue: ${error})`,
    );
  }

  console.log("\n=== COMPILATION TEST ===");
  // TypeScript compilation test
  try {
    // If this code compiles and runs, major type issues are fixed
    const manager2 = new StudentManager();
    manager2.addStudent(student1);
    const found = manager2.getStudentById(1);
    const removed = manager2.removeStudent(1);
    const avg = manager2.calculateAverageGrade([90, 80]);
    const active = manager2.getActiveStudents();

    console.log("✅ TypeScript Compilation: PASSED");
  } catch (error) {
    console.log(`❌ TypeScript Compilation: FAILED (${error})`);
  }

  console.log("\n🎉 Test suite completed!");
  console.log(
    "\nIf all tests pass, congratulations! You have successfully fixed all 10 bugs.",
  );
  console.log(
    "If some tests fail, review the failing test descriptions to understand what needs to be fixed.",
  );
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
