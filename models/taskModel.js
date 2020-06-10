const mongoose = require( 'mongoose' );

//add 'checked' to saved characteristics

const taskSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    /*objective: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'objectives',
        required: false
    },*/
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities',
        required: false
    }

});

const taskModel = mongoose.model('tasks', taskSchema);

const Tasks = {
    upload: function (newObject) {
        return taskModel
            .create(newObject)
            .then(createdObject => {
                return createdObject;
            })
            .catch(err => {
                throw new Error(err.message);
            });

    },
    getAll: function () {
        return taskModel
            .find()
            .populate('activity', ['id'])
            //.populate('objective', ['id'])
            .then(allObjects => {
                return allObjects;
            })
            .catch(err => {
                return err;
            })
    },
    clearAll: function () {
        return taskModel
            .deleteMany({})
            .then(result => {
                return result;
            })
            .catch(err => {
                throw new Error(err.message);
            })
    }
}

module.exports = { Tasks };