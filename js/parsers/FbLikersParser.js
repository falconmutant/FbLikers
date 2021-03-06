/**
 * Fb Likers
 * @constructor
 */
FbLikersParser = function () {};

/**
 * Run parser on current page
 * @param callback
 */
FbLikersParser.prototype.run = function (callback) {
    var self = this;
    self._openLikersPopup(function () {
        self._loadAllLikersPages(function () {
            var profilesId = self._getLikersProfilesId();
            var dataForReturn = [];
            for(var key in profilesId){
                if(profilesId.hasOwnProperty(key)){
                    dataForReturn.push({
                        'type' : 'like',
                        'fb_id' : profilesId[key]
                    })
                }
            }
            callback(dataForReturn);
        })
    });
};

/**
 * Load all pages with likers on popup
 * @param callback
 */
FbLikersParser.prototype._loadAllLikersPages = function (callback) {
    // Load all likers pages
    var nextPageInterval = setInterval(function () {
        var nextPageElementSelector = '#reaction_profile_pager';

        nextPageElement = $(nextPageElementSelector + ' a');
        if (!nextPageElement.length) {
            clearInterval(nextPageInterval);
            callback();
        } else {
            eventFire(nextPageElement[0], 'click');
            nextPageElement.click();
        }
    }, 1000);
};

/**
 * Open popup with likers
 * @param {function} callback
 */
FbLikersParser.prototype._openLikersPopup = function (callback) {
    setTimeout(function () {
        eventFire($('._2x4v')[0], 'click');
        setTimeout(function () {
            // return callback
            callback();
        }, 1000);
    }, 2000);
};

/**
 * Get array with profiles id
 * @param callback
 * @returns {Array}
 */
FbLikersParser.prototype._getLikersProfilesId = function (callback) {
    // Parse likers profile urls
    var likersAElements = $('._5j0e.fsl.fwb.fcb a'),
        results = [],
        profileData;
    likersAElements.each(function () {
        try {
            profileData = $(this).attr('data-gt');
            profileData = JSON.parse(profileData);
            results.push(profileData.engagement.eng_tid);
        }catch (e){}
    });
    return results;
};