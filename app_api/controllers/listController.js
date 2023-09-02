const mongoose = require('mongoose');
const List = mongoose.model('lists');
const User = mongoose.model('users');

//Get userList for list-home

const getUserList = (req, res) => {
    getUser(req, res, async (req, res, userID) => {
        if (userID) {
            try {
                const userList = await List.find({userID : userID});
                if (!userList) {
                return res.status(404);
                } else {
                    return res.status(200).json(userList);
                }
            } catch (err) {
                    return res.status(500).json(err.message);
                }
         } else {
            return res.status(401);
         }
    });
}

//Add item to userList

const addItem =(req, res) => {
    getUser(req, res, async (req, res, userID) => {
        if (!userID) {
            return res.status(500).json({response: false});
        } else {
                const newItem = new List();
                newItem.name = req.body.name;
                newItem.priority = req.body.priority;
                newItem.description = req.body.description;
                newItem.estTime = req.body.estTime;
                newItem.userID = userID;
                try {
                    await List.create(newItem);
                    res.status(200).json({response: true});
                } catch {
                    res.status(500).json({response: false});
                }

        }
    })
}

//Delete item from userList

const deleteItem = (req, res) => {
    getUser(req, res, async (req, res, userID) => {
        if (!userID) {
            return res.status(404).json({response: false});
        } else {
            try {
                const deleted = await List.findOneAndDelete({userID: userID, name: req.params.itemName});
                if (deleted) {
                    return res.status(200).json({response: true})
                    } else {
                        return res.status(404).json({response: false})
                    }
                }
                catch (err) {
                    res.status(500).json(err.message);
                }
        }
    })
}

//Update the status of the item

const updateStatus = (req, res) => {
    getUser(req, res, async (req, res, userID) => {
        if (!userID) {
            console.log("userID was not found");
            return res.status(404).json({response: false});
        } else {
            try {
                const updatedStatus = await List.findOneAndUpdate({userID: userID, name: req.body.name}, {status: req.params.status}, {new: true});
                if (!updatedStatus) {
                    return res.status(404).json({response: false});
                } else {
                    return res.status(200).json({response: true});
                }
            } catch (err) {
                console.log("There was an error updating the status")
                return res.status(500).json(err.message);
            }
        }
    })
}

//Search for item in userList by name

const searchItem = (req, res) => {
    getUser(req, res, async (req, res, userID) => {
        if (!userID) {
            return res.status(404);
        } else {
            try {
                const foundItem = await List.find({userID: userID, name: req.params.itemName});
                if (!foundItem) {
                    return res.status(200);
                } else {
                    return res.status(200).json(foundItem);
                }
            } catch (err) {
                return res.status(500).json(err.message);
            }
        }
    })
}

//Update item from edit-form

const updateItem = (req, res) => {
    getUser(req, res, async (req, res, userID) => {         //get userID
        if (!userID) {
            return res.status(404);
        } else {
            try {
                const updatedItem = await List.findOneAndUpdate({userID: userID, name: req.body.name}, {            //update item using userID and itemID
                    name: req.body.name,
                    priority: req.body.priority,
                    description: req.body.description,
                    status: req.body.status,
                    estTime: req.body.estTime
                }, {new: true});
                if (!updatedItem) {
                    res.status(404).json({response: false});
                } else {
                    return res.status(200).json({response: true});
                }
            } catch (err) {
                return res.status(500).json(err.message);
            }
        }
    })
}

//Get UserID
const getUser = async (req, res, callback) => {
    if (req.auth && req.auth.email) {
        try {
            const activeUser = await User.findOne({email: req.auth.email})
            if (!activeUser) {
                return res.status(401).json({"message": "User not found"});
            } else {
                console.log(activeUser.userID);
                callback(req, res, activeUser.userID);
            }
        } catch (err) {
            return res.status(500).json(err.message);
        }
    } else {
        return res.status(401).json("message: no authentication")
    }
}





module.exports = {
    getUserList,
    addItem,
    deleteItem,
    updateStatus,
    searchItem,
    updateItem,
}