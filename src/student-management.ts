// Student Management System - TypeScript Practice with 10 Bugs
// Use the CODE method: Context, Objective, Draft, Expectations

interface Student {
  id: number;
  name: string;
  email: string;
  grades: number[];
  isActive: boolean;
}

interface Course {
  id: number;
  name: string;
  credits: number;
  students: Student[];
}

class StudentManager {
  private students: Student[] = [];
  private courses: Course[] = [];

  // BUG 1: Type annotation issue
  // HINT: Check the return type - should this function return void?
  addStudent(student: Student): boolean {
    this.students.push(student);
    console.log(`Added student: ${student.name}`);
  }

  // BUG 2: Array method misuse
  // HINT: find() returns undefined when no match is found, but we're not handling that case
  getStudentById(id: number): Student {
    return this.students.find((student) => student.id === id);
  }

  // BUG 3: Logic error in condition
  // HINT: The condition seems backwards - when should we actually remove a student?
  removeStudent(id: number): boolean {
    const index = this.students.findIndex((student) => student.id === id);
    if (index !== -1) {
      this.students.splice(index, 1);
      return false;
    }
    return true;
  }

  // BUG 4: Array mutation during iteration
  // HINT: What happens when you modify an array while iterating over it?
  deactivateFailingStudents(): void {
    for (let i = 0; i < this.students.length; i++) {
      const avgGrade = this.calculateAverageGrade(this.students[i].grades);
      if (avgGrade < 60) {
        this.students.splice(i, 1);
      }
    }
  }

  // BUG 5: Division by zero and type safety
  // HINT: What happens when grades array is empty? Also check the reduce usage.
  calculateAverageGrade(grades: number[]): number {
    const sum = grades.reduce((acc, grade) => acc + grade);
    return sum / grades.length;
  }

  // BUG 6: Incorrect use of array method
  getActiveStudents(): Student[] {
    return this.students
      .filter((student) => student.isActive === true)
      .map((student) => student.isActive);
  }

  // BUG 7: Object property access without null checking
  getCourseStudentCount(courseId: number): number {
    const course = this.courses.find((c) => c.id === courseId);
    return course.students.length;
  }

  // BUG 8: Promise handling and type inference issues
  async loadStudentsFromAPI(): Promise<Student[]> {
    try {
      const response = await fetch("/api/students");
      const data = response.json();
      this.students = data;
      return this.students;
    } catch (error) {
      console.log("Failed to load students");
      return [];
    }
  }

  // BUG 9: Complex type narrowing and generic constraints
  updateStudentGrades<T extends { grades: number[] }>(
    studentData: T,
    newGrades: (string | number)[],
  ): T {
    const validGrades = newGrades.filter((grade) => {
      if (typeof grade === "string") {
        const parsed = parseInt(grade);
        return !isNaN(parsed) && parsed >= 0 && parsed <= 100;
      }
      return grade >= 0 && grade <= 100;
    });

    studentData.grades = validGrades;
    return studentData;
  }

  // BUG 10: Advanced async/await with Promise.all error handling
  async generateStudentReports(): Promise<string[]> {
    const reportPromises = this.students.map(async (student) => {
      const courses = await this.getStudentCourses(student.id);
      const avgGrade = this.calculateAverageGrade(student.grades);

      if (courses.length === 0) {
        throw new Error(`No courses found for student ${student.name}`);
      }

      return `${student.name}: ${avgGrade.toFixed(2)} (${courses.length} courses)`;
    });

    const reports = await Promise.all(reportPromises);
    return reports;
  }

  private async getStudentCourses(studentId: number): Promise<Course[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          this.courses.filter((course) =>
            course.students.some((student) => student.id === studentId),
          ),
        );
      }, Math.random() * 100);
    });
  }
}

export { StudentManager, Student, Course };
