const Content = require('../models/contentSchema');
const Clone = require('../models/cloneSchema');

async function createService(body) {

    const existingClone = await Clone.findOne({ parentId: body.parentId });             

    if (existingClone) {
        return existingClone;
    }
    else {
        const parentContent = await Content.findById(body.parentId);        //a clone is created if it wasnt created before.
        const newClone = new Clone({                                        //lazy creation of clone allows unnecessary wastage of space.
            parentId: parentContent._id.toString(),
            content: parentContent.content,
        })
        return await newClone.save()

    }
}

module.exports = {
    createService
}