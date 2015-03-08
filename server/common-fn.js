var restify = require("restify");

var getBasicBodyHandler = function(permissionName, logger, validationFn, handler)
{
	return function(req, res, next)
	{
		if(!req.user || !req.user.permissions[permissionName])
        {
			logger.error("Unauthorized user");
            return next(new restify.UnauthorizedError());
        }
		
		var obj = req.body;
		if(!validationFn || (validationFn && validationFn(obj)))
		{
			if(handler)
			{
				handler(req, res, obj);
			}
		}
		else
		{
			logger.error("Invalid model object");
			logger.error(obj);
			return next(new restify.BadRequestError());
		}
		
		next();
	};
};

module.exports = {
	getModelLister: function(model, logger, sort)
	{
		return function(req, res, next)
		{
			var query = model.find({});
			if(sort)
			{
				query = query.sort(sort);
			}
			
			query.exec(function(err, objs)
			{
				if(err)
				{
					logger.error(err);
					res.send(500);
				}
				{
					res.send(200, objs);
				}
			});
			next();
		};
	},
	getModelCreator: function(DBModel, permissionName, logger, validationFn, postProcessFn)
	{
		return getBasicBodyHandler(permissionName, logger, validationFn, function(req, res, obj)
		{
			delete obj._id;
			
			var modelObj = new DBModel(obj);
			if(postProcessFn)
			{
				postProcessFn(modelObj);
			}
			
			modelObj.save(function(err)
			{
				if(err)
				{
					logger.error(err);
					res.send(500);
				}
				else
				{
					res.send(200, modelObj);
				}
			});
		});
	},
	getModelUpdater: function(model, parameterName, permissionName, logger, validationFn, postProcessFn)
	{
		return getBasicBodyHandler(permissionName, logger, validationFn, function(req, res, obj)
		{
			delete obj._id;
			
			if(postProcessFn)
			{
				postProcessFn(obj);
			}
			
			model.update({ _id: req.params[parameterName] }, obj, { upsert: true }).exec(function(err)
			{
				if(err)
				{
					logger.error(err);
					res.send(500);
				}
				else
				{
					res.send(200);
				}
			});
		});
	},
	getModelDeleter: function(model, parameterName, permissionName, logger, postProcessFn)
	{
		return function(req, res, next)
		{
			if(!req.user || !req.user.permissions[permissionName])
			{
				return next(new restify.UnauthorizedError());
			}
			
			model.findOne({ _id: req.params[parameterName] }).exec(function(err, modelObj)
			{
				if(err)
				{
					logger.error(err);
					res.send(500);
				}
				else if(modelObj)
				{
					modelObj.remove(function(err)
					{
						if(err)
						{
							logger.error(err);
							res.send(500);
						}
						else
						{
							if(postProcessFn)
							{
								postProcessFn(modelObj);
							}
							res.send(200);
						}
					});
				}
				else
				{
					res.send(200);
				}
			});

			next();
		};
	}
};
