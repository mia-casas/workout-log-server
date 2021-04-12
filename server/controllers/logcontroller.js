const Express = require('express');
const router = Express.Router();
const validateJWT = require("../middleware/validate-jwt")
const {LogModel} = require('../models');

router.get('/workoutlog', (req, res) => {
    res.send('Test 1..2..3')
});

// Create Log Entry
router.post('/create', validateJWT, async (req, res) => {
    const {description, definition, result} = req.body.log;
    const {id} = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner: id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch(err){
        res.status(500).json({error: err});
    }
    // LogModel.create(logEntry) <-- Duplicate 
});


// View All Personal Logs
router.get("/mine", validateJWT, async (req, res) => {
    let {id} = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userLogs)
    } catch (err){
        res.status(500).json({error: err})
    }
});
// View Logs by ID
router.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const results = await LogModel.findAll({
            where: {id: id}
        });
        res.status(200).json(results);
    } catch(err){
        res.status(500).json({error: err});
    }
});

// Update Log
// router.put("/update/:entryId", validateJWT, async (req, res) => {
//     const {description, definition, result} = req.body.log;
//     const logId = req.params.entryId;
//     const userId = req.user.id;

//     const query = {
//         where: {
//             id: logId,
//             owner: userId
//         }
//     };
//     const updatedLog = {
//         description: description,
//         definition: definition,
//         result: result
//     };
//     try {
//         const update = await LogModel.update(updatedLog, query);
//         res.status(200).json({update, message:("Entry Successfully Update")});
//     } catch(err){
//         res.status(500).json({error: err});
//     }
// });



// Delete Log
// router.delete("/delete/:id", validateJWT, async (req, res) => {
//     const ownerId = req.user.id;
//     const logId = req.params.id;
//     try {
//         const query = {
//             where: {
//                 id: logId,
//                 owner: ownerId
//             }
//         };
//         await LogModel.destroy(query);
//         res.status(200).json({message: "Log deleted"})
//     } catch (err){
//         res.status(500).json({error: err});
//     }
// })