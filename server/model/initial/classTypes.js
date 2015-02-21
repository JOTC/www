module.exports = [
	{
		name: "Puppy Manners",
		description: "This class is specially tailored to a puppy's limited attention span.  You learn how to teach basic obedience commands and receive tips on socialization, care, and raising a puppy.",
		prerequisite: "3-5 months of age",
		isAdvanced: false,
		priorityOrder: 1
	},
	{
		name: "Basic Obedience",
		description: "This class teaches basic obedience commands such as heel, sit, down, stay, come, and other commands that you will use in everyday life with your pet.",
		prerequisite: "6 months of age and older",
		isAdvanced: false,
		priorityOrder: 2
	},
	{
		name: "CGC/Advanced",
		description: "Builds on the basic obedience class and teaches the exercises necessary to obtain AKC's Canine Good Citizen (CGC) certification.",
		prerequisite: "requires basic obedience",
		isAdvanced: true,
		priorityOrder: 3
	},
	{
		name: "Rally",
		description: "",
		prerequisite: "requires basic obedience",
		isAdvanced: true,
		priorityOrder: 4
	}
];