const firstLevel = [
    ["a", "f", "k", "p", "u", "z"],
    ["b", "g", "l", "q", "v"],
    ["c", "h", "m", "r", "w"],
    ["d", "i", "n", "s", "x"],
    ["e", "j", "o", "t", "y"]
];

const secondLevel = [
    [1, 5, 3, 6, 4, 2],
    [6, 3, 5, 2, 1, 4],
    [5, 4, 2, 1, 6, 3],
    [2, 6, 4, 5, 3, 1],
    [3, 1, 6, 4, 2, 5],
    [4, 2, 1, 3, 5, 6]
];

const thirdLevel = [
    [2, 6, 4, 1],
    [3, 2, 1, 4],
    [5, 6, 3, 2],
    [5, 6, 1, 4],
    [3, 1, 2, 6],
    [5, 2, 4, 3],
    [2, 3, 6, 5],
    [1, 5, 3, 6],
    [5, 3, 6, 2],
    [3, 5, 6, 1],
    [5, 2, 3, 6],
    [3, 5, 6, 2],
    [4, 1, 5, 3],
    [1, 4, 5, 6],
    [4, 5, 6, 3],
    [2, 5, 3, 6],
    [2, 5, 3, 2],
    [3, 5, 2, 1],
    [3, 2, 5, 4],
    [3, 3, 5, 2],
    [2, 5, 3, 5],
    [2, 6, 3, 4],
    [6, 5, 3, 4],
    [2, 5, 3, 4],
    [3, 5, 1, 4],
    [6, 5, 2, 3]
]


function cipherFirstLevel(text) {
    let result = "";
    for (let textlen = 0; textlen < text.length; textlen++) {
        if (!isLetter(text.charAt(textlen))) {
            result = result + text.charAt(textlen);
            continue;
        }
        for (let column = 0; column < firstLevel.length; column++) {
            for (let line = 0; line < firstLevel[column].length; line++) {
                if (text[textlen].toLowerCase() === firstLevel[column][line]) {
                    result = result + (column + 1) + (line + 1);
                }
            }
        }
    }
    return result
}

function decipherFirstLevel(cipher) {
    let result = "";
    for (let cipherIndex = 0; cipherIndex < cipher.length - 1; cipherIndex += 2) {
        if (isNaN(cipher[cipherIndex])) {
            result += cipher[cipherIndex--];
            continue;
        }
        result += firstLevel[cipher[cipherIndex] - 1][cipher[cipherIndex + 1] - 1]
    }
    return result;
}

function cipherSecondLevel(firstLevelCipher) {
    let result = "";
    for (let cipherIndex = 0; cipherIndex < firstLevelCipher.length; cipherIndex++) {
        if (isNaN(firstLevelCipher.charAt(cipherIndex))) {
            result = result + firstLevelCipher.charAt(cipherIndex);
            continue;
        }
        const randomColumn = Math.floor(Math.random() * 6)
        for (let line = 0; line < secondLevel[randomColumn].length; line++) {
            if (firstLevelCipher[cipherIndex] == secondLevel[randomColumn][line]) {
                result += (randomColumn + 1).toString() + (line + 1).toString();
                break
            }
        }
    }
    return result;
}

function decipherSecondLevel(cipher) {
    let result = "";
    for (let cipherIndex = 0; cipherIndex < cipher.length - 1; cipherIndex += 2) {
        if (isNaN(cipher[cipherIndex])) {
            result += cipher[cipherIndex--];
            continue;
        }
        result += secondLevel[cipher[cipherIndex] - 1][cipher[cipherIndex + 1] - 1]
    }
    return result;
}

function cipherThirdLevel(secondLevelCipher) {
    let result = ""
    for (let cipherIndex = 0; cipherIndex < secondLevelCipher.length; cipherIndex++) {
        if (isNaN(secondLevelCipher[cipherIndex])) {
            result += secondLevelCipher[cipherIndex];
            continue;
        }
        loop:
            while (true) {
                const randomColumn = Math.floor(Math.random() * 26)
                for (let line = 0; line < thirdLevel[randomColumn].length; line++) {
                    if (secondLevelCipher[cipherIndex] == thirdLevel[randomColumn][line]) {
                        result += (randomColumn + 1).toString() + String.fromCharCode(65 + line);
                        break loop;
                    }
                }
            }
    }
    return result;
}

function decipherThirdLevel(cipher) {
    let result = "";
    let column = "";
    for (let cipherIndex = 0; cipherIndex < cipher.length; cipherIndex++) {
        const char = cipher[cipherIndex].toLowerCase();
        if (!isNaN(char)) {
            column += char;
            continue;
        }
        if (isLetter(char)) {
            column = Number(column) - 1;
            result += thirdLevel[column][char.charCodeAt(0) - 97];
            column = "";
            continue;
        }
        result += char;
    }
    return result
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-zA-Z]/i)
}

function cipher() {
    const textfield = document.getElementById("text");
    const cipherfield = document.getElementById("cipher");
    const text = textfield.value;

    if (text !== "") {
        cipherfield.value = cipherThirdLevel(cipherSecondLevel(cipherFirstLevel(text)));
    } else if (cipherfield.value !== "") {
        try {
            textfield.value = decipherFirstLevel(decipherSecondLevel(decipherThirdLevel(cipherfield.value)));
        } catch (e) {
            return;
        }
    }
}