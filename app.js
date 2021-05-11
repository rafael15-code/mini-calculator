let select = elem => document.querySelector(elem);

const calculator = select(".calculator");

const keyContainer = select(".calculator__keys");

let display = select(".calculator__display-main");

const clear = () => {
	var dataSet = calculator.dataset;
	for (key in dataSet) {
		calculator.removeAttribute(
			"data-" +
				key
					.split(/(?=[A-Z])/)
					.join("-")
					.toLowerCase()
		);
	}
};

const removeDepressedState = key => {
	Array.from(key.parentNode.children).forEach(k =>
		k.classList.remove("is-depressed")
	);
};

const calculate = (n1, operator, n2 = undefined) => {
    let firstNumber = parseFloat(n1);
	let secondNumber = parseFloat(n2);

	if (operator === "add") return firstNumber + secondNumber;

	if (operator === "multiply") return firstNumber * secondNumber;

	if (operator === "divide") return firstNumber / secondNumber;

	if (operator === "subtract") return firstNumber - secondNumber;

	if (operator === "percentage") return firstNumber / 100;
};

keyContainer.addEventListener("click", function initialize(e) {
	if (e.target.matches("button")) {
		let action = e.target.dataset.action;

		let key = e.target;

		let keyContent = key.textContent;

		let displayValue = display.innerText;

		let smallDisplay = select(".calculator__display-small");

		const previousKeyType = calculator.dataset.previousKeyType;
		// if(smallDisplay.innerText === '0' && !action){
		//     smallDisplay.innerText = keyContent;

		// }
		// else{}
		if (action !== "clear") {
			const clearButton = document.querySelector("[data-action = clear]");
			clearButton.textContent = "CE";
		}

		if (!action) {
			
			if (displayValue === "0" || previousKeyType == "operator") {
				display.innerText = keyContent;
				removeDepressedState(key);
			} else if (previousKeyType == "equals") {
				display.innerText = keyContent;
				calculator.dataset.firstNumber = "";
				calculator.dataset.operator = "";
			} else {
				display.innerText += keyContent;
			}
			calculator.dataset.previousKeyType = "number";
		}
		if (action == "clear") {
			if (key.textContent == "AC") {
				clear();
			} else {
				key.textContent = "AC";
			}
			calculator.dataset.previousKeyType = "clear";
			display.innerText = "0";
			smallDisplay.innerText = "0";
			removeDepressedState(key);
		}
		if (
			action === "add" ||
			action === "subtract" ||
			action === "multiply" ||
			action === "divide"
		) {
			if (displayValue !== "0") {
				removeDepressedState(key);

				key.classList.add("is-depressed");

				calculator.dataset.previousKeyType = "operator";

				if (
					calculator.dataset.firstNumber &&
					previousKeyType !== ("equals" || "operator")
				) {
					display.innerText = calculate(
						calculator.dataset.firstNumber,
						calculator.dataset.operator,
						displayValue
					);
				}

				calculator.dataset.operator = action;

				calculator.dataset.firstNumber = display.innerText;
			}
		}
		if (action === "decimal") {
			calculator.previousKeyType = "decimal";

			if (!display.innerText.includes(".") && previousKeyType !== "operator") {
				display.innerText += keyContent;
			} else if (previousKeyType === "operator") {
				display.innerText = "0";
				removeDepressedState(key);
				clear();
			}
		}
		if (action === "percentage") {
			calculator.dataset.operator = action;
			let firstNumber = display.innerText;
			display.innerText = calculate(firstNumber, action);
			calculator.dataset.previousKeyType = "operator";
		}
		if (action === "equals") {
			if (calculator.dataset.firstNumber) {
				let firstNumber = calculator.dataset.firstNumber;
				let secondNumber = display.innerText;
				let operator = calculator.dataset.operator;

				if (document.querySelector(".clear").innerText == "CE") {
					document.querySelector(".clear").innerText = "AC";
				}

				if (previousKeyType === "equals") {
					firstNumber = display.innerText;
					secondNumber = calculator.dataset.modValue;
				}

				display.innerText = calculate(firstNumber, operator, secondNumber);
				removeDepressedState(key);
				calculator.dataset.modValue = secondNumber;
				calculator.dataset.previousKeyType = "equals";
			}
		}

		// Small display
	}
});
