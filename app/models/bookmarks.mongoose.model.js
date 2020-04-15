module.exports = function(mongoose) {
    const BookmarkSchema = mongoose.Schema({
        status: Number
    
    });
    var model =  mongoose.model('Boomark', BookmarkSchema, 'Bookmarks');
    console.log("Bookmarks model is ");
    console.log(model);
    return model;
} 