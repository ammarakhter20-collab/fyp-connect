const PassFailCriteria = require("../../models/CoordinatorModels/PassFailCriteriaModel");

// Controller function to create a new pass/fail criteria
const createPassFailCriteria = async (req, res) => {
    try {
        // Extract data from the request body
        const { term, passingCriteria } = req.body;

        // Validate input
        if (!term || passingCriteria === undefined) {
            return res.status(400).json({ error: "Term and passing criteria are required" });
        }

        if (passingCriteria < 0 || passingCriteria > 100) {
            return res.status(400).json({ error: "Passing criteria must be between 0 and 100" });
        }

        // Check if criteria already exists for this term
        const existingCriteria = await PassFailCriteria.findOne({ term });
        if (existingCriteria) {
            return res.status(409).json({
                error: "Pass/Fail criteria already exists for this term. Please update instead."
            });
        }

        // Create a new pass/fail criteria object
        const newCriteria = new PassFailCriteria({
            term,
            passingCriteria,
        });

        // Save the criteria to the database
        await newCriteria.save();

        // Populate term details
        await newCriteria.populate('term');

        // Return success response
        res.status(201).json({
            message: "Pass/Fail criteria created successfully",
            criteria: newCriteria,
        });
    } catch (error) {
        console.error("Error creating pass/fail criteria:", error);
        // Return error response
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to get all pass/fail criteria
const getAllPassFailCriteria = async (req, res) => {
    try {
        // Fetch all criteria from the database and populate term details
        const criteria = await PassFailCriteria.find().populate('term').sort({ createdAt: -1 });

        // Return the fetched criteria
        res.status(200).json({ criteria });
    } catch (error) {
        console.error("Error fetching pass/fail criteria:", error);
        // Return error response
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to get pass/fail criteria by term
const getPassFailCriteriaByTerm = async (req, res) => {
    try {
        const { termId } = req.params;

        // Find criteria by term ID
        const criteria = await PassFailCriteria.findOne({ term: termId }).populate('term');

        if (!criteria) {
            return res.status(404).json({ error: "Pass/Fail criteria not found for this term" });
        }

        // Return the fetched criteria
        res.status(200).json({ criteria });
    } catch (error) {
        console.error("Error fetching pass/fail criteria by term:", error);
        // Return error response
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to update pass/fail criteria
const updatePassFailCriteria = async (req, res) => {
    try {
        // Extract data from the request body
        const { passingCriteria } = req.body;
        const { id } = req.params;

        // Validate input
        if (passingCriteria === undefined) {
            return res.status(400).json({ error: "Passing criteria is required" });
        }

        if (passingCriteria < 0 || passingCriteria > 100) {
            return res.status(400).json({ error: "Passing criteria must be between 0 and 100" });
        }

        // Find the criteria by ID
        const criteria = await PassFailCriteria.findById(id);

        if (!criteria) {
            return res.status(404).json({ error: "Pass/Fail criteria not found" });
        }

        // Update the passing criteria field
        criteria.passingCriteria = passingCriteria;

        // Save the updated criteria to the database
        await criteria.save();

        // Populate term details
        await criteria.populate('term');

        // Return success response
        res.status(200).json({
            message: "Pass/Fail criteria updated successfully",
            criteria: criteria,
        });
    } catch (error) {
        console.error("Error updating pass/fail criteria:", error);
        // Return error response
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    createPassFailCriteria,
    getAllPassFailCriteria,
    getPassFailCriteriaByTerm,
    updatePassFailCriteria,
};
