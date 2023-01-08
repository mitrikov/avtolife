const popups = { // Ids of all popups
	dublicat : 39,
	registration : 49,
	to : 56,
	osago : 227,
	calc : 93,
	anyQuestions : 259,
	thanks : 276
};

const closedModalHashStateId = "#modalClosed";
const openModalHashStateId = "#modalOpen";
let currentModalId = 39

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
	"Один стандартный (длинный)" : {
		price : 2100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/09/one-number.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	"Два сдандартных (2 длинных)" : { 
		price : 3200,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/2-standart.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	"Квадратный (1шт)" : { 
		price : 2600,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Number-Kub.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	"Комбо (1 длинный + 1 квадратный)" : { 
		price : 4500,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/standart-kub.png",
		format : regNumberFormats.default,
		placeholder : "A001AA"
	},
	"Тракторный (1шт)" : { // Тракторные
		price : 3100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Traktor.png",
		format : regNumberFormats.moto,
		placeholder : "0001AA"
	},
	"Мото (мини)" : { // Мото
		price : 2600,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Number-Moto.png",
		format : regNumberFormats.moto,
		placeholder : "0001АА"
	},
	"Полицейский" : { // Ментовские
		price : 2100,
		imgUrl : "https://avtolife.online/wp-content/uploads/2021/10/Police.png",
		format : regNumberFormats.mvd,
		placeholder : "А0001"
	},
	"Военный" : { // Военные
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
	"Взять за меня заявление в ГИБДД" : {
		price : 2000,
		icon : "fa-user-edit"
	},
	"Снять а/м с учета без моего участия" : {
		price : 3000,
		icon : "fa-handshake-slash"
	},
	"Проверить а/м на наличие ограничений" : {
		price : 1000,
		icon : "fa-check-double"
	},
	"Восстановить утраченные документы без моего участия" : {
		price : 3000,
		icon : "fa-undo"
	},
	"Внести изменения (прописка, фамилия и т.д.) без моего участия" : {
		price : 3000,
		icon : "fa-file-signature"
	},
	"Зарегистрировать а/м без моего участия." : {
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
	//phoneInput.style.padding = "0px 0px 0px 24px" // Отступ от +7

	new IMask(phoneInput, {
		mask: '+7(000)000-00-00',
	});
}

let changeNumberData = (type) => { // Меняет данные в соотвествии с выбором типа гос. номера (картинка, цена, placeholder, шаблон валидации)
	let img = document.querySelector("#number-image img"),
		price = document.querySelector("#number-price h3"),
		form = document.querySelector("#form-field-reg_number"),
		gosnomerDefaultNumberForm = document.querySelector("#form-field-reg_number");

	const hiddenPriceField = document.querySelector("#form-field-price")


	img.src = numbersData[type].imgUrl;
	img.setAttribute('srcset','');
	price.innerText = numbersData[type].price + " руб.";
	hiddenPriceField.value = numbersData[type].price
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

	const hiddenPriceField = document.querySelector("#form-field-price")

	price.innerText = regData[type].price + " руб.";
	hiddenPriceField.value = regData[type].price
	icon.className = "fa "+ regData[type].icon;
}

const addThanksAlertOnSubmit = () => { // Выводит окно "Спасибо за заказ!", закрывая текущее окно
	document.querySelector(".elementor-popup-modal form").addEventListener("submit", (e) => {
		elementorProFrontend.modules.popup.closePopup( {}, e);
		elementorProFrontend.modules.popup.showPopup( { id: popups.thanks } )
	});
}

const getForms = () => {
	const prefix = "#form-field";

	const forms = {
		username : document.querySelector(`${prefix}-name`),
		phone : document.querySelector(`${prefix}-phone`),
		carName : document.querySelector(`${prefix}-car_name`),
		regNumber : document.querySelector(`${prefix}-reg_number`),
		regNumberType : document.querySelector(`${prefix}-reg_number_type`),
		regService : document.querySelector(`${prefix}-reg_service`),
		regionCode : document.querySelector(`${prefix}-region_code`),
		email: document.querySelector(`${prefix}-email`)
	}

	for(const formElem in forms) {
		if(!forms[formElem]) delete forms[formElem]
	}
	
	return forms;
}

const addFormDataSavingToLocalStorage = () => {
	const forms = getForms()
	const values = loadFormDataFromLocalStorage()

	for(const formElem in forms) {
		let timeout;
		values[formElem] = forms[formElem].value

		forms[formElem].addEventListener("input", e => {
			clearTimeout(timeout)
			timeout = setTimeout(() => {
				values[formElem] = forms[formElem].value
				if(!values[formElem]) delete values[formElem]
				localStorage.avtolife = JSON.stringify(values)

				console.log(JSON.parse(localStorage.avtolife))
			}, 1000)
		})
	}
}

const loadFormDataFromLocalStorage = () => {
	const forms = getForms()
	let values = {}

	if(!localStorage.avtolife) return values;

	values = JSON.parse(localStorage.avtolife)

	for(const formElem in forms) {
		if(values[formElem]) {
			forms[formElem].value = values[formElem]
		}
	}

	return values;
}


	jQuery(document).on('elementor/popup/show', (event, id, instance) => { // Селекторы доступны только после события октрытия попапа
		
		addFormDataSavingToLocalStorage()

		if (window.history && window.history.pushState && id !== popups.thanks) {
		    window.location.hash = openModalHashStateId;
		    currentModalId = id
		}	
		
		if(id == popups.dublicat) {
			customizeRegNumberForm("#form-field-reg_number") // Gos. nomer input selector
	
			const selectType = document.querySelector("#form-field-reg_number_type")

			selectType.addEventListener("input", (e) => {
				changeNumberData(selectType.value);
			})

			changeNumberData(selectType.value)
			customizePhoneNumberForm("#form-field-phone")
			addThanksAlertOnSubmit()
		}

		if(id == popups.registration) {
			customizePhoneNumberForm("#form-field-phone")

			const selectType = document.querySelector("#form-field-reg_service")

			selectType.addEventListener("change", (e) => {
				changeRegistrationData(e.target.value)
			});
			changeRegistrationData(selectType.value)

			addThanksAlertOnSubmit()
		}
		
		if(id == popups.to) {
			customizeRegNumberForm("#form-field-reg_number");
			customizePhoneNumberForm("#form-field-phone");
			addThanksAlertOnSubmit();
		}
		
		if(id == popups.osago) {
			customizePhoneNumberForm("#form-field-phone");
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
			return
		}

		if(window.location.hash === openModalHashStateId ) {
			window.history.back();
		}
	});

	jQuery(window).on('popstate', function(e) {
        if(window.location.hash !== openModalHashStateId ) {
        	elementorFrontend.documentsManager.documents[currentModalId].getModal().hide()
        }
    })

	numbersData.cacheImages();

	let vhMobileFix = () => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	}

	window.addEventListener("resize", () => {
		vhMobileFix();
	});