var mongoose = require("mongoose");

var imageSchema = mongoose.Schema({
	description: String,
	path: String,
	added: { type: Date, default: Date.now }
})

var imageGallerySchema = mongoose.Schema({
	name: String,
	description: String,
	created: { type: Date, default: Date.now },
	images: [ imageSchema ]
});

module.exports = {
	images: mongoose.model("images", imageSchema),
	galleries: mongoose.model("imageGalleries", imageGallerySchema)
};