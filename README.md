# TypeScript Bug Hunting Practice

## Overview
This project contains a Student Management System with **10 intentional bugs** for you to find and fix using the **CODE method**.

## The CODE Method
- **C**ontext: Understand what the code is supposed to do
- **O**bjective: Identify what's wrong and what needs to be fixed
- **D**raft: Write or plan your solution
- **E**xpectations: Test and verify your fix works

## Setup
```bash
npm install
npm run type-check  # This will show TypeScript errors
npm run build       # Try to compile
```

## The Challenge
There are **10 bugs** of increasing difficulty in `src/student-management.ts`:

### Bugs 1-5 (With Hints)
These bugs have hints in the comments to guide you.

### Bugs 6-10 (No Hints)
These are more challenging - you'll need to use the CODE method independently.

## Bug Difficulty Progression
1. **Basic Type Issues** - Return type mismatches
2. **Null Safety** - Handling undefined returns
3. **Logic Errors** - Incorrect boolean logic
4. **Array Manipulation** - Issues with iteration and mutation
5. **Edge Cases** - Division by zero, empty arrays
6. **Array Method Misuse** - Wrong return types from array methods
7. **Object Access** - Null reference errors
8. **Async/Await** - Promise handling issues
9. **Generic Constraints** - Complex type filtering and conversion
10. **Advanced Async** - Promise.all error handling

## How to Approach Each Bug

1. **Read the function name and understand its purpose**
2. **Look at the input parameters and expected output**
3. **Trace through the logic step by step**
4. **Identify what could go wrong**
5. **Test your fix thoroughly**

## Testing Your Fixes

### Quick Type Check
After fixing each bug, run:
```bash
npm run type-check
npm run build
```

### Comprehensive Test Suite
To verify all your fixes are correct, run the automated test suite:
```bash
npm test
```

This will run comprehensive tests for all 10 bugs and show you:
- ✅ Which bugs you've fixed correctly
- ❌ Which bugs still need work
- Specific feedback on what's wrong

### Test Categories
The test suite checks:
1. **Return types** - Functions return correct types
2. **Null safety** - Proper handling of undefined values
3. **Logic correctness** - Functions behave as expected
4. **Error handling** - No crashes on edge cases
5. **Type safety** - Proper TypeScript compilation

### Example Test Output
```
✅ addStudent returns void: PASSED
❌ getStudentById handles non-existent student: FAILED
✅ removeStudent logic: PASSED
```

The code at the bottom of the main file will also help you test manually.

## Success Criteria
- All TypeScript compilation errors are resolved
- The code runs without runtime errors
- All functions behave as their names suggest
- Edge cases are properly handled

Good luck, and remember to apply the CODE method systematically!