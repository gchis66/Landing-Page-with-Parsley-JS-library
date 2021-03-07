const btnBurger = document.querySelector('#btnBurger');
const overlay = document.querySelector('#overlay');
const mobileMenu = document.querySelector('.mobile-menu');
const fadeElems = document.querySelectorAll('.has-fade');
const body = document.querySelector('body');

btnBurger.addEventListener('click', function() {
    if(btnBurger.classList.contains('open')){
        body.classList.remove('no-scroll');
        btnBurger.classList.remove('open');
        fadeElems.forEach(function(element){
            element.classList.remove('fade-in');
            element.classList.add('fade-out');
        })

    } else{
        body.classList.add('no-scroll');
        btnBurger.classList.add('open');
        fadeElems.forEach(function(element){
            element.classList.add('fade-in');
            element.classList.remove('fade-out');
        })
    }
})


$(function () {
var $sections = $('.form-section');

function navigateTo(index) {
// Mark the current section with the class 'current'
$sections
.removeClass('current')
.eq(index)
.addClass('current');
// Show only the navigation buttons that make sense for the current section:
$('.form-navigation .previous').toggle(index > 0);
var atTheEnd = index >= $sections.length - 1;
$('.form-navigation .next').toggle(!atTheEnd);
$('.form-navigation [type=submit]').toggle(atTheEnd);
}

function curIndex() {
// Return the current index by looking at which section has the class 'current'
return $sections.index($sections.filter('.current'));
}

// Previous button is easy, just go back
$('.form-navigation .previous').click(function() {
navigateTo(curIndex() - 1);
});

// Next button goes forward iff current block validates
$('.form-navigation .next').click(function() {
$('.demo-form').parsley().whenValidate({
group: 'block-' + curIndex()
}).done(function() {
navigateTo(curIndex() + 1);
});
});

// Prepare sections by setting the `data-parsley-group` attribute to 'block-0', 'block-1', etc.
$sections.each(function(index, section) {
$(section).find(':input').attr('data-parsley-group', 'block-' + index);
});
navigateTo(0); // Start at the beginning

// Parsley validation for zip code
Parsley.addValidator('zip', {
    validateString: function(value, country) {
      // Zippopotam.us returns a status 404 for incorrect zip codes,
      // so we simply return the ajax request:
      return $.ajax('//www.zippopotam.us/' + country + '/' + value)
    },
    messages: {en: 'There is no such zip for the country "%s"'}
  });
  Parsley.addValidator('stateAndZip', {
    validateString: function(_ignoreValue, country, instance) {
      var state = instance.$element.find('[name="state"]').val();
      var zip = instance.$element.find('[name="zip"]').val();
      var xhr = $.ajax('//www.zippopotam.us/' + country + '/' + zip)
      // When Zippopotam.us returns the info of the given zip, check it:
      return xhr.then(function(json) {
        var actualState = json.places[0]['state abbreviation'];
        if (actualState !== state) {
          // We could return `false`, but for an even better result
          // we can fail the promise with a custom error message:
          return $.Deferred().reject("The zip code " + zip + " is in " + actualState + ", not in " + state);
          // Note: in jQuery 3.0+, you can `throw('my custom error')` for the same result
        }
      })
    },
    // The following error message will still show if the xhr itself fails
    // (404 because zip does not exist, network error, etc.)
    messages: {en: 'There is no such zip for the country "%s"'}
  });

  // Parsley validation for Over 18 age

  window.Parsley.addValidator('minage', {
    validateString: function(birthday){
        // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd
        var optimizedBirthday = birthday.replace(/-/g, "/");
    
        //set date based on birthday at 01:00:00 hours GMT+0100 (CET)
        var myBirthday = new Date(optimizedBirthday);
    
        // set current day on 01:00:00 hours GMT+0100 (CET)
        var currentDate = new Date().toJSON().slice(0,10)+' 01:00:00';
    
        // calculate age comparing current date and borthday
        var myAge = ~~((Date.now(currentDate) - myBirthday) / (31557600000));
    
        if(myAge < 18) {
                 return false;
            }else{
            return true;
        }
    } ,
    messages: {
      en: 'You must be over the age of 18',
    }
  });

});
