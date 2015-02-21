var months = Object.freeze([ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]);
var shortMonths = Object.freeze([ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]);
var days = Object.freeze([ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]);

module.exports = Object.freeze({
	months: months,
	shortMonths: shortMonths,
	days: days,
	stringDateRange: function(date1, date2)
	{
		if(date1 > date2)
		{
			var tmp = date1;
			date1 = date2;
			date2 = tmp;
		}
		
		var stringDateRange = "";		
		if(date1.getUTCMonth() === date2.getUTCMonth())
		{
			stringDateRange = shortMonths[date1.getUTCMonth()] + " " + date1.getUTCDate() + "-" + date2.getUTCDate();
		}
		else
		{
			stringDateRange = shortMonths[date1.getUTCMonth()] + " " + date1.getUTCDate() + "-" + shortMonths[date2.getUTCMonth()] + " " + date2.getUTCDate();
		}
		
		return stringDateRange;
	}
});