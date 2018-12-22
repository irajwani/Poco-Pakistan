function avenirNextText(color,fontSize,fontWeight, textAlign, fontStyle) {

    this.fontFamily = 'Avenir Next';
    this.fontWeight = fontWeight ? fontWeight : '400';
    this.fontSize = fontSize ? fontSize : 18;
    this.color= color ? color : 'black';
    this.textAlign = textAlign ? textAlign : 'justify'
    this.fontStyle = fontStyle ? fontStyle : 'normal';

}

export {avenirNextText}