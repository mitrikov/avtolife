const popups = { // Ids of all popups
	dublicat : 39,
	registration : 49,
	to : 56,
	osago : 227,
	calc : 93,
	anyQuestions : 259,
	thanks : 276
};

const regNumberFormats = { // Number Formats
	default : /^[АВЕКМНОРСТУХ](?!000)\d{3}[АВЕКМНОРСТУХ]{2}$/u,
	trailer : /^[АВЕКМНОРСТУХ]{2}(?!0000)\d{4}$/u,
	moto : /^(?!0000)\d{4}[АВЕКМНОРСТУХ]{2}$/u,
	transit: /^[АВЕКМНОРСТУХ]{2}(?!000)\d{3}[АВЕКМНОРСТУХ]$/u,
	departure: /^Т[АВЕКМНОРСТУХ]{2}(?!000)\d{3}$/u,
	mvd : /^[АВЕКМНОРСТУХ](?!0000)\d{4}$/u,
	military : /^(?!0000)\d{4}[АВЕКМНОРСТУХ]{2}$/u
};

const numbersData = { // Сменяемые данные в окне Дубликаты
	default : {
		price : 2100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/09/one-number.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	double : { 
		price : 3200,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/2-standart.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	square : { 
		price : 2600,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Number-Kub.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	defaultAndSquare : { 
		price : 4500,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/standart-kub.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	tractor : { // Тракторные
		price : 3100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Traktor.png",
		format : regNumberFormats.moto,
		placeholder : "0001AA"
	},
	moto : { // Мото
		price : 2600,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Number-Moto.png",
		format : regNumberFormats.moto,
		placeholder : "0001АА"
	},
	mvd : { // Ментовские
		price : 2100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Police.png",
		format : regNumberFormats.mvd,
		placeholder : "А0001"
	},
	military : { // Военные
		price : 2100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Voennii.png",
		format : regNumberFormats.military,
		placeholder : "0001АА"
	},

	cacheImages : function () { // Кэш изображений, чтобы их было видно сразу при смене типа
		let images = [];
		for(let el in this) {
			if(typeof this[el] === "object") {
				images[el] = new Image();
				images[el].src = this[el].imgUrl;
			}
		}
	}
}

const regData = { // Цены и иконки в окне Регистрация в ГИБДД
	takeStatement : {
		price : 2000,
		icon : "fa-user-edit"
	},
	unregAuto : {
		price : 3000,
		icon : "fa-handshake-slash"
	},
	checkLimits : {
		price : 1000,
		icon : "fa-check-double"
	},
	restore : {
		price : 3000,
		icon : "fa-undo"
	},
	change : {
		price : 3000,
		icon : "fa-file-signature"
	},
	regAuto : {
		price : 5000,
		icon : "fa-car"
	}
}

let isValidRegNumber = (number, type) => { // Проверка номера на валидность
	let isValid = false;
	if(type == "all") {
		for(let format in regNumberFormats) {
			if(number.match(regNumberFormats[format]) != null) {
				isValid = true;
			}
		}
	} else if(number.match(numbersData[type].format) != null) {
		isValid = true;
	}
	return isValid;
}

let validateRegNumberForm = (elem, type) => { // Валидация формы номера
	elem.value = elem.value.toUpperCase();  // Auto-uppercase
	if(elem.value.length >= numbersData[type].placeholder.length) {    // On end of input
		if(isValidRegNumber(elem.value, type)) {
			elem.setCustomValidity(""); // If input is OK, remove error Message
		} else {
			elem.validity.valid = false;
			elem.setCustomValidity("Неправильный формат автомобильного номера");
			elem.reportValidity(); // Show custom message on input
		}
	}
}

let customizeRegNumberForm = (formSelector) => { // Вешаются события и параметры на формы гос. номера
	const gosForm = document.querySelector(formSelector);
	gosForm.setAttribute("maxlength", 6);
	gosForm.addEventListener("input", () => {
		validateRegNumberForm(gosForm, "default");
	});
}

let customizePhoneNumberForm = (formSelector) => { // Вешаются события и параметры на формы номера телефона
	const phoneInput = document.querySelector(formSelector);
	phoneInput.style.padding = "0px 0px 0px 24px" // Отступ от +7

	new IMask(phoneInput, {
		mask: '(000)000-00-00',
	});
}

let changeNumberData = (type) => { // Меняет данные в соотвествии с выбором типа гос. номера (картинка, цена, placeholder, шаблон валидации)
	let img = document.querySelector("#number-image img"),
		price = document.querySelector("#number-price h3"),
		form = document.querySelector("#form-field-gosnomer_default__number_form"),
		gosnomerDefaultNumberForm = document.querySelector("#form-field-gosnomer_default__number_form");

	img.src = numbersData[type].imgUrl;
	img.setAttribute('srcset','');
	price.innerText = numbersData[type].price + " руб.";
	form.placeholder = numbersData[type].placeholder;
	form.setAttribute("maxlength", numbersData[type].placeholder.length);

	gosnomerDefaultNumberForm.addEventListener("input", () => {
		validateRegNumberForm(gosnomerDefaultNumberForm, type);
	});
	
	validateRegNumberForm(gosnomerDefaultNumberForm, type);
}


let changeRegistrationData = (type) => { // Меняет цену и иконку в окне "Регистрация в ГИБДД"
	let icon = document.querySelector("#reg-icon i"),
		price = document.querySelector("#reg-price h3");

	price.innerText = regData[type].price + " руб.";
	icon.className = "fa "+ regData[type].icon;
}

let addThanksAlertOnSubmit = () => { // Выводит окно "Спасибо за заказ!", закрывая текущее окно
	document.querySelector(".elementor-popup-modal form").addEventListener("submit", (e) => {
		elementorProFrontend.modules.popup.closePopup( {}, e);
		elementorProFrontend.modules.popup.showPopup( { id: popups.thanks } )
	});
}


	jQuery(document).on('elementor/popup/show', (event, id, instance) => { // Селекторы доступны только после события октрытия попапа	
		if(id == popups.dublicat) {
			customizeRegNumberForm("#form-field-gosnomer_default__number_form"); // Gos. nomer input selector
	
			const selectType = document.querySelector("#form-field-field_67befb2");
			selectType.addEventListener("change", (e) => {
				changeNumberData(e.target.value);
			});
			
			customizePhoneNumberForm("#form-field-gosnomer_default__phone_form");
			addThanksAlertOnSubmit();
		}

		if(id == popups.registration) {
			customizePhoneNumberForm("#form-field-field_65f2c3a");

			const selectType = document.querySelector("#form-field-reg_data_select");
			selectType.addEventListener("change", (e) => {
				changeRegistrationData(e.target.value);
			});
			addThanksAlertOnSubmit();
		}
		
		if(id == popups.to) {
			customizeRegNumberForm("#form-field-message");
			customizePhoneNumberForm("#form-field-field_497a2b5");
			addThanksAlertOnSubmit();
		}
		
		if(id == popups.osago) {
			customizePhoneNumberForm("#form-field-field_65f2c3a");
			addThanksAlertOnSubmit();
		}
		
		if(id == popups.anyQuestions) {
			customizePhoneNumberForm("#form-field-feedback_phone");
			elementorProFrontend.modules.popup.closePopup( {}, event);
		}
		
		if(id == popups.thanks) {
			document.querySelector("#thanks-ok-icon").addEventListener("click", (e) => {
				elementorProFrontend.modules.popup.closePopup( {}, e);
			});
		}
	});	
	
	jQuery(document).on('elementor/popup/hide', (event, id, instance) => {
		if(id == popups.calc) {
			elementorProFrontend.modules.popup.showPopup( { id: popups.anyQuestions } );
		}	
	});

	numbersData.cacheImages();