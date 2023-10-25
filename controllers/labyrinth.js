const {
  apiSuccessWithData,
  apiValidationErrors,
  apiError
} = require("../utils/apiHelpers");
const Labyrinth = require("../models/Labyrinth");
const Cell = require("../models/Cell");
const { Types } = require("mongoose");
const { convertCoordinatesToDirections } = require("../services/generate_directions_using_coords");
const { findPathUsingDFS, findPathUsingBFS } = require("../services/generate_path");

// return all the labyrinths for the current user
exports.allLabyrinths = async (req, res) => {
  try {

    const labyrinths = await Labyrinth.find({ userId: req.user.userId })
      .populate({
        path: "cells",
        options: { sort: { x: 1, y: 1 } }
      })
      .exec();

    res.status(200).json(apiSuccessWithData("Your Labyrinths", labyrinths));
  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};

// return a specific labyrinth of the user by id 
exports.getLabyrinthById = async (req, res) => {
  try {

    const pipeline = [

      {
        $match: {
          userId: new Types.ObjectId(req.user.userId),
          _id: new Types.ObjectId(req.params.id),
        }
      },
      {
        $lookup: {
          from: "cells",
          localField: "_id",
          foreignField: "labyrinthId",
          as: "cells"
        }
      },
      {
        $unwind: "$cells"
      },
      {
        $sort: {
          "cells.x": 1,
          "cells.y": 1
        }
      },
      {
        $group: {
          _id: "$_id",
          userId: { $first: "$userId" },
          cells: { $push: "$cells" }
        }
      }
    ];

    const labyrinth = await Labyrinth.aggregate(pipeline);

    res.status(200).json(apiSuccessWithData("Labyrinth", labyrinth));

  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};

// create an empty labyrinth and returns the labyrinth id
exports.createLabyrinth = async (req, res) => {
  try {

    const labyrinth = await Labyrinth.create({ userId: req.user.userId });

    res.status(201).json(
      apiSuccessWithData(
        "Labyrinth is created!",
        { labyrinthId: labyrinth._id }
      )
    );

  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};

// set the type of the specific block of the labyrinth using x/y coordinates
// (type is either "empty" or "filled")
exports.setBlockTypeUsingCoordinates = async (req, res) => {
  try {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);

    if (x > 6 || x < 0 || y > 3 || y < 0) {
      return res.status(403).json(apiValidationErrors([
        { x: `x cannot be greater than 6 or less than 0` },
        { y: `y cannot be greater than 3 or less than 0` }
      ]));
    };

    const query = { labyrinthId: req.params.id, x, y };

    const updatedCell = await Cell.findOneAndUpdate(
      query,
      { type: req.params.type },
      { upsert: true, new: true, useFindAndModify: false }
    );

    res.status(201).json(apiSuccessWithData("Cell has been updated", updatedCell));
  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};



// set the starting block of the labyrinth using x/y coordinates
exports.setStartingBlockUsingCoordinates = async (req, res) => {
  try {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);

    if (x > 6 || x < 0 || y > 3 || y < 0) {
      return res.status(403).json(apiValidationErrors([
        { x: `x cannot be greater than 6 or less than 0` },
        { y: `y cannot be greater than 3 or less than 0` }
      ]));
    }

    const query = { labyrinthId: req.params.id, x, y };

    let cell = await Cell.findOne(query);

    if (cell.isEnd == true) {
      return res.status(403).json(apiError("Cell cannot be set to Start because it is already set to End!"));
    }

    cell.isStart = true;

    cell?.save();

    return res.status(201).json(apiSuccessWithData("Cell has been updated to START", cell));

  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};

exports.setEndingBlockUsingCoordinates = async (req, res) => {
  try {
    const x = parseInt(req.params.x);
    const y = parseInt(req.params.y);

    if (x > 6 || x < 0 || y > 3 || y < 0) {
      return res.status(403).json(apiValidationErrors([
        { x: `x cannot be greater than 7 or less than 0` },
        { y: `y cannot be greater than 4 or less than 0` }
      ]));
    }

    const query = { labyrinthId: req.params.id, x, y };

    let cell = await Cell.findOne(query);

    if (cell.isStart == true) {
      return res.status(403).json(apiError("Cell cannot be set to End because it is already set to Start!"));
    }

    cell.isEnd = true;

    cell?.save();

    return res.status(201).json(apiSuccessWithData("Cell has been updated to END", cell));

  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};

// return a solution for the labyrinth:
exports.solveLabyrinth = async (req, res) => {
  try {
    const labyrinthId = req.params.id;

    const labyrinth = await Labyrinth
      .findById(labyrinthId)
      .populate("cells")
      .exec();

    if (!labyrinth) {
      return res.status(404).json(apiError("Labyrinth not found!"));
    }

    const startCell = labyrinth.cells.find((cell) => cell.isStart);

    if (!startCell) {
      return res.status(404).json(apiError("Starting cell not found"));
    }

    const visited = new Set();
    const path = await findPathUsingDFS(labyrinth, startCell, visited);

    if (path) {
      // Extract path coordinates and the directions
      const solutionCoordinates = path.map((cell) => ({ x: cell.x, y: cell.y }));
      const solutionDirections = convertCoordinatesToDirections(solutionCoordinates);
      res.status(200).json(apiSuccessWithData("Solution Found Successfully!", { solutionDirections, solutionCoordinates }));
    } else {
      res.status(404).json(apiError("No solution found"));
    }
  } catch (err) {
    res.status(500).json(apiError(err.message));
  }
};