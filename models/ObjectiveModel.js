const mongoose = require( 'mongoose' );

const objectiveSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'activities',
        required: false
    }
});

const objectiveModel = mongoose.model('objectives', objectiveSchema);

const Objectives = {
    upload: function (newObject) {
        return objectiveModel
            .create(newObject)
            .then(createdObject => {
                return createdObject;
            })
            .catch(err => {
                throw new Error(err.message);
            });

    },
    getAll: function () {
        return objectiveModel
            .find()
            .populate('activity', ['id'])
            .then(allObjects => {
                return allObjects;
            })
            .catch(err => {
                throw new Error( err.message);
            })
    },
    clearAll: function () {
        return objectiveModel
            .deleteMany({})
            .then(result => {
                return result;
            })
            .catch(err => {
                 throw new Error (err.message)
            })
    }
}

module.exports = { Objectives };