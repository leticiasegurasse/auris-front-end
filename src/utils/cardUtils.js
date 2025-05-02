import LogoCard from "../assets/cards/default.svg"
import LogoVisa from "../assets/cards/visa.png"
import LogoMastercard from "../assets/cards/mastercard.png"
import LogoElo from "../assets/cards/elo.png"
import LogoAmex from "../assets/cards/amex.png"
import LogoDiners from "../assets/cards/diners.png"
import LogoDiscover from "../assets/cards/discover.png"
import LogoJCB from "../assets/cards/jcb.webp"
import LogoHipercard from "../assets/cards/hipercard.png"

export function getCardFlag(cardNumber) {
    const cleanNumber = cardNumber.replace(/\D/g, ""); // Remove tudo que não for número

    const cardFlags = [
        { name: "Visa", regex: /^4\d{12}(\d{3})?$/, image: LogoVisa },
        { name: "Mastercard", regex: /^5[1-5]\d{14}$/, image: LogoMastercard },
        { name: "Elo", regex: /^(636368|438935|504175|451416|636297)\d{10}$/, image: LogoElo },
        { name: "Amex", regex: /^3[47]\d{13}$/, image: LogoAmex },
        { name: "Diners", regex: /^3(0[0-5]|[68]\d)\d{11}$/, image: LogoDiners },
        { name: "Discover", regex: /^6(?:011|5\d{2})\d{12}$/, image: LogoDiscover },
        { name: "JCB", regex: /^(?:2131|1800|35\d{3})\d{11}$/, image: LogoJCB },
        { name: "Hipercard", regex: /^(606282|3841[46])\d{10}$/, image: LogoHipercard },
    ];

    const flag = cardFlags.find((card) => card.regex.test(cleanNumber));
    return flag ? flag.image : LogoCard;
};
