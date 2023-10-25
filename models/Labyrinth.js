const mongoose = require("mongoose");
const Cell = require("./Cell");

const Schema = mongoose.Schema;

const labyrinthSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rows: {
      type: Number,
      default: 4,
    },
    columns: {
      type: Number,
      default: 7,
    },
    cells: [
      {
        type: Schema.Types.ObjectId,
        ref: "Cell",
      },
    ],
  }, { timestamps: true }
);

// Middleware function to create default cells
labyrinthSchema.pre("save", async function (next) {
  if (!this.isNew) {
    // If it's not a new labyrinth, do nothing
    return next();
  }

  const cells = [];

  // Generate cells based on rows and columns
  for (let x = 0; x < this.columns; x++) {
    for (let y = 0; y < this.rows; y++) {
      cells.push({
        labyrinthId: this._id,
        type: 'empty', // Default cell type
        x,
        y,
      });
    }
  }

  // Create the cells in the database
  try {
    const createdCells = await Cell.create(cells);
    this.cells = createdCells.map((cell) => cell._id);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Labyrinth", labyrinthSchema);