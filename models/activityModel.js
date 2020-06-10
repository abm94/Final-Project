const mongoose = require( 'mongoose' );

const activitySchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true,
        unique : true
    }
});

const activitiesCollection = mongoose.model( 'activities', activitySchema );

const Activities = {
    upload: function (newActivity) {
        return activitiesCollection
                .create( newActivity )
                .then( createdActivity => {
                    return createdActivity;
                })
                .catch( err => {
                    throw new Error( err );
                });
    },
    getAll: function () {
        return activitiesCollection
                .find()
                .then( all => {
                    return all;
                })
                .catch( err => {
                    return err;
                });
    },
    getOne: function (id) {
        return activitiesCollection
            .findOne({ id: id })
            .then(result => {
                return result;
            })
             .catch(err => {
                throw new Error(err);
            })
    },
    clearAll: function () {
        return activitiesCollection
            .deleteMany({})
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message);
            })
            
    }

}

module.exports = { Activities };