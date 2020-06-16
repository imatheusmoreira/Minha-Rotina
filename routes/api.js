const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const TaskDetails = require('../models/TaskDetails')
const Tag = require('../models/Tag')

const mongoose = require('mongoose')
const db = "mongodb+srv://tarefas:yrIuRZZA2lI4LQrT@cluster0-pqhy1.mongodb.net/tasksdb?retryWrites=true&w=majority"

mongoose.set('useFindAndModify', false);
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
	if (err) {
		console.error('Error! ' + err)
	} else {
		console.log('Conectado ao mongo db!')
	}
})

router.get('/', (req, res) => {
	res.send('from API route')
})

//TASK
router.get('/tasks', (req, res) => {
	//params accepted tag_id e finished
	Task.find(req.query, (err, data) => {
		if (!err) {
			res.status(200).send(data)
		}
		else {
			res.status(500).send({ "error": "Error in retrieving tasks list :'" + err })
			console.log('Error in retrieving tasks list :' + err);
		}
	}).sort({ date: 'desc' });
})
//Get one task
router.get('/task/:id', (req, res) => {
	Task.findOne({ _id: req.params.id }, (err, task) => {
		if (err) {
			console.log(err)
			res.status(500).send({ "error": "Error getting task. See logs for more details" })
		}
		else {
			if (!task)
				res.status(401).send({ "error": "Invalid id" })
			else {
				TaskDetails.findOne({ task_id: req.params.id }, (error, taskDetails) => {
					if (error) {
						console.log(error)
						res.status(500).send({ "error": "Error getting task details. See logs for more details" })
					} else {
						var taskAndDetails = {};
						taskAndDetails.task = task; // Array1.
						taskAndDetails.taskDetails = taskDetails; // Array2.
						res.status(200).send(taskAndDetails)
					}
				}	
				)
			}
		}
	});
})
//Save a task
router.put('/task', (req, res) => {
	let taskData = req.body.task
	let task = new Task(taskData)
	let taskDetailsData = req.body.taskDetails
	let taskDetails = new TaskDetails(taskDetailsData)

	task.save((error1, registeredTask) => {
		if (error1) {
			console.log(error1)
			res.status(500).send({ "error": error1.message })
		} else {
			taskDetails.task_id = registeredTask._id
			taskDetails.save((error2, registeredTaskDetails) => {
				if (error2) {
					console.log(error2)
					res.status(500).send({ "error": error2.message })
				} else {
					var taskAndDetails = {};
					taskAndDetails.task = registeredTask; // Array1.
					taskAndDetails.taskDetails = registeredTaskDetails; // Array2.
					res.status(200).send(taskAndDetails)
				}
			})
		}
	})
})
//update
router.post('/task', (req, res) => {
	let taskData = req.body.task
	let task = new Task(taskData)
	let taskDetailsData = req.body.taskDetails
	let taskDetails = new TaskDetails(taskDetailsData)

	Task.findByIdAndUpdate({ _id: taskData._id }, task, (error1, registeredTask) => {
		if (error1) {
			console.log(error1)
			res.status(500).send({ "error": error1.message })
		} else {
			TaskDetails.findByIdAndUpdate({ _id: taskDetailsData._id }, taskDetails, (error2, registeredTaskDetails) => {
				if (error2) {
					console.log(error2)
					res.status(500).send({ "error": error2.message })
				} else {
					var taskAndDetails = {};
					taskAndDetails.task = registeredTask; // Array1.
					taskAndDetails.taskDetails = registeredTaskDetails; // Array2.
					res.status(200).send(taskAndDetails)
				}
			});
		}
	});
})
//change start stop - falta só atualizar o current task
router.get('/task/change/status/:id/:status', (req, res) => {
	Task.findOne({ _id: req.params.id }, (error, task) => {
		if (error) {
			console.log(error)
			res.status(500).send({ "error": "Error getting task. See logs for more details" })
		} else {
			Task.updateMany({ user_uid: task.user_uid }, { "$set": { status: false } }, (error1, writeResult) => {
				if (!error1) {
					Task.findByIdAndUpdate({ _id: req.params.id }, { status: req.params.status }, (error2, registeredTask) => {
						if (error2) {
							res.status(500).send({ "error": error2.message })
						} else {
							res.status(200).send(registeredTask)
						}
					});
				}
			});
		}
	})
})

//Remove a task and details
router.delete('/task/:id', (req, res) => {
	var task_id = req.params.id;
	Task.findByIdAndRemove(task_id, (err1, doc) => {
		if (!err1) {
			Task.findOneAndRemove({ task_id: task_id }, (err2, doc) => {
				if (!err2) {
					res.status(200).send({ "message": "The task has been removed" })
				} else {
					res.status(404).send({ "error": "Error in task details delete : " + err2 })
				}
			});
		} else {
			res.status(404).send({ "error": "Error in task delete : " + err1 })
		}
	});
})

//TAG
//Save a tag
router.get('/tags', (req, res) => {
	Tag.find(req.query, (err, data) => {
		if (!err) {
			res.status(200).send(data)
		}
		else {
			res.status(500).send({ "error": "Error in retrieving tags list :'" + err })
			console.log('Error in retrieving tags list :' + err);
		}
	}).sort({ date: 'desc' });
})
//Save a tag
router.post('/tag', (req, res) => {
	let tagData = req.body
	let tag = new Tag(tagData)
	tag.save((error, registeredTag) => {
		if (error) {
			console.log(error)
		} else {
			res.status(200).send(registeredTag)
		}
	})
})
//Remove a tag
router.delete('/tag/:id', (req, res) => {
	Tag.findByIdAndRemove(req.params.id, (err, doc) => {
		if (!err) {
			res.status(200).send({ "message": "The tag has been removed" })
		} else {
			res.status(404).send({ "error": "Error in tag delete :" + err })
		}
	});
})

module.exports = router