const asyncHandler = require("express-async-handler");
const TeacherEval = require("./../models/TeacherEval");
const mongoose = require("mongoose");

// Controller for updating or submitting teacher evaluation
const submitTeacherEval = asyncHandler(async (req, res) => {
  const { studentId, teacherId, ...evalValues } = req.body;

  let teacherEval = await TeacherEval.findOne({
    student: studentId,
    teacher: teacherId,
  });

  if (!teacherEval) {
    // If no evaluation exists for the student, create a new one
    teacherEval = await TeacherEval.create({
      student: studentId,
      teacher: teacherId,
      ...evalValues,
    });
  } else {
    // If an evaluation already exists for the student, update it
    teacherEval.set(evalValues);
    await teacherEval.save();
  }

  res.status(200).json({
    message: "Teacher evaluation submitted successfully",
    teacherEval,
  });
});

// Controller for selecting records with the same teacher Id and calculating average values
const getTeacherEvalAverages = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  try {
    const pipeline = [
      {
        $match: {
          teacher: new mongoose.Types.ObjectId(teacherId),
        },
      },
      {
        $group: {
          _id: null,
          punctualityAvg: { $avg: "$punctuality" },
          preparationAvg: { $avg: "$preparation" },
          effectivenessAvg: { $avg: "$effectiveness" },
          disciplineAvg: { $avg: "$discipline" },
          interestAvg: { $avg: "$interest" },
          explanationAvg: { $avg: "$explanation" },
          ictUsageAvg: { $avg: "$ictUsage" },
          examsAndProjectsAvg: { $avg: "$examsAndProjects" },
          doubtsClarificationAvg: { $avg: "$doubtsClarification" },
          portionCompletionAvg: { $avg: "$portionCompletion" },
        },
      },
    ];

    const result = await TeacherEval.aggregate(pipeline);

    // Ensure there's a result before returning
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for the provided teacherId" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { submitTeacherEval, getTeacherEvalAverages };
