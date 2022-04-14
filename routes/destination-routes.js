const express = require("express");
const router = express.Router();

const Travels = require("../dbHelpers");

// DESTINATIONS

router.get("/destinations", (req, res) => {
	Travels.getAllDestinations()
		.then((destinations) => {
			res.status(200).json(destinations);
		})
		.catch((error) => {
			res.status(500).json({ message: "Cannot get destinations." });
		});
});

router.post("/users/:id/destinations", (req, res) => {
	const { id } = req.params;
	const newDestination = req.body;
	if (!newDestination.user_id) {
		newDestination["user_id"] = parseInt(id, 10);
	}
	Travels.findUserById(id).then((user) => {
		if (!user) {
			res.status(404).json({ message: "User does not exist." });
		}
		if (!newDestination.title || !newDestination.description) {
			res.status(404).json({ message: "All fields must be complete." });
		}
		Travels.addDestination(newDestination, id)
			.then((destination) => {
				res.status(200).json(destination);
			})
			.catch((error) => {
				res.status(500).json({ error });
			});
	});
});

router.delete("/destinations/:id", (req, res) => {
	const { id } = req.params;
	Travels.removeDestination(id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: "Destination is deleted." });
			} else {
				res.status(404).json({ message: "No destination with that id." });
			}
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
});

router.patch("/destinations/:id", (req, res) => {
	const { id } = req.params;
	Travels.updateDestination(id, req.body)
		.then((destination) => {
			res.status(200).json({ message: "Destination updted." });
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
});

// GROUP BY

router.get("/destinationNumbers", (req, res) => {
	Travels.groupDestinations()
		.then((destination) => {
			res.status(200).json(destination);
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
});
module.exports = router;
