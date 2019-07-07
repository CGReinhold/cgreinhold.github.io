class CGRCode {
  constructor({ 
    text = '',
    height = 300,
    color = '#000000',
    backgroundColor = '#FFFFFF',
    marginX = 50,
    marginY = 50,
    rotation = 0,
    shape = 'circle',
    symbols = 'triangles',
    symbolWidth = 4,
    symbolHeight = null,
    symbolMargin = null,
    image = undefined,
    imageXMargin = 0,
    imageYMargin = 0,
    imageHeight = 100,
    imageWidth = 100,
    imageRotation = 0,
    style = ''
  }) {
    this.text = text;
    this.height = height;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.marginX = marginX;
    this.marginY = marginY;
    this.rotation = rotation;
    this.shape = shape;
    this.symbols = symbols;
    this.symbolWidth = symbolWidth;
    this.symbolHeight = symbolHeight;
    this.symbolMargin = symbolMargin;
    this.image = image;
    this.imageXMargin = imageXMargin;
    this.imageYMargin = imageYMargin;
    this.imageHeight = imageHeight;
    this.imageWidth = imageWidth;
    this.imageRotation = imageRotation;
    this.style = style;
  }

  _textToNumber(text) {
    const encoder = new Encoder();
    return encoder.encode(text);
    // if (text && text.length < 5) {
    //   text = '00000'.concat(text).slice(-5);
    // }
    // return text.split('').map((char) => '00'.concat(char.charCodeAt(0).toString(3)).slice(-6)).join('');
  };

  generate(divID) {
    const canvas = document.createElement('canvas');
    canvas.id = "cgrcode";
    canvas.width = this.height * 2;
    canvas.height = this.height * 2;
    canvas.style.position = "absolute";
    canvas.style = this.style;
    this.canvas = canvas;

    this.context = canvas.getContext('2d');
    this.context.scale(2, 2)
    this.context.clearRect(0, 0, this.height, this.height);
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, canvas.width, canvas.height);
    this.context.lineWidth = this.symbolWidth;
    
    if (this.image) {
      var image = new Image();
      image.onload = () => {
        this.context.save();
        this.context.translate(this.imageXMargin + (this.imageWidth / 2), this.imageYMargin + (this.imageHeight / 2));
        this.context.rotate(this.imageRotation * Math.PI / 180);
        this.context.drawImage(image, -(this.imageWidth / 2), -(this.imageHeight / 2), this.imageWidth, this.imageHeight);
        this.context.restore();
        this.context.save();
        this.context.translate(this.height / 2, this.height / 2);
        this.context.rotate(this.rotation * Math.PI / 180);
        this._drawCode(divID, canvas);
        this.context.restore();
      }
      image.crossOrigin = 'Anonymous';
      image.src = this.image;
    } else {
      this._drawCode(divID, canvas);
    }
  }

  save() {
    var image = this.canvas.toDataURL("image/png");
    window.open(image);
  }

  _drawCode(divID, canvas) {
    const div = document.getElementById(divID);
    div.innerHTML = '';
    div.appendChild(canvas);

    let sequence = this._textToNumber(this.text);
    sequence = '4' + sequence;
    switch(this.shape) {
      case 'square':
        this._outlineSquare(sequence);
        break;
      case 'circle':
        this._outlineCircle(sequence);
        break;
      case 'triangle':
        this._outlineTriangle(sequence);
        break;
    }
  }

  /// Symbols
  /// The folowing symbols are currently implemented:
  /// Square, Filled Square, Circle, Filled Circle, Triangle, Filled Triangle, Line, Cross
  
  _square(x, y, height) {
    this.context.strokeStyle = this.color;
    this.context.rect(x, y, height, height);
  }

  _squareLine(x, y, height) {
    this.context.strokeStyle = this.color;
    this.context.rect(x, y, height, height);
    this.context.stroke();
    this.context.lineWidth = this.symbolWidth;
    this.context.beginPath();
    this.context.moveTo(x + height / 2, y);
    this.context.lineTo(x + height / 2, y + height);
  }

  _squarePoint(x, y, height) {
    this.context.strokeStyle = this.color;
    this.context.rect(x, y, height, height);
    const newX = x + (height / 2) - (this.symbolWidth / 2) - 2;
    const newY = y + (height / 2) - (this.symbolWidth / 2) - 2;
    this.context.fillStyle = this.color;
    this.context.fillRect(newX, newY, this.symbolWidth + 4, this.symbolWidth + 4)
  }

  _fillSquare(x, y, height) {
    this.context.fillStyle = this.color;
    this.context.fillRect(x, y, height, height);
  }

  _circle(x, y, height) {
    const radius = height / 2;
    const middleX = height / 2;
    const middleY = height / 2;
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.arc(x + middleX, y + middleY, radius, 0, 2 * Math.PI);
    this.context.stroke();
  }

  _circleLine(x, y, height) {
    const radius = height / 2;
    const middleX = height / 2;
    const middleY = height / 2;
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.arc(x + middleX, y + middleY, radius, 0, 2 * Math.PI);
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(x + height / 2, y);
    this.context.lineTo(x + height / 2, y + height);
  }

  _fillCircle(x, y, height) {
    this._circle(x, y, height);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  _circlePoint(x, y, height) {
    this._circle(x, y, height);

    const newX = x + (height / 2) - (this.symbolWidth / 2);
    const newY = y + (height / 2) - (this.symbolWidth / 2);
    this._circle(newX, newY, this.symbolWidth);
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  _triangle(x, y, height) {
    const middleX = height / 2;
    const middleY = height / 2;
    this.context.beginPath();
    this.context.moveTo(x + middleX, y);
    this.context.lineTo(x + middleX * 2, y + middleY * 2);
    this.context.lineTo(x, y + middleY * 2);
    this.context.closePath();
    this.context.strokeStyle = this.color;
    this.context.stroke();
  }

  _triangleLine(x, y, height) {
    const middleX = height / 2;
    const middleY = height / 2;
    this.context.beginPath();
    this.context.moveTo(x + middleX, y);
    this.context.lineTo(x + middleX * 2, y + middleY * 2);
    this.context.lineTo(x, y + middleY * 2);
    this.context.closePath();
    this.context.strokeStyle = this.color;
    this.context.stroke();
    this.context.beginPath();
    this.context.moveTo(x + height / 2, y);
    this.context.lineTo(x + height / 2, y + height);
  }

  _fillTriangle(x, y, height) {
    this._triangle(x, y, height)
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  _trianglePoint(x, y, height) {
    this._triangle(x, y, height)

    const newX = x + (height / 2) - (this.symbolWidth / 2);
    const newY = y + (height / 1.5) - (this.symbolWidth / 2);
    this._triangle(newX, newY, this.symbolWidth);

    this.context.fillStyle = this.color;
    this.context.fill();
  }

  _line(x, y, height) {
    this.context.lineWidth = this.symbolWidth;
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(x, y + height / 2);
    this.context.lineTo(x + height, y + height / 2);
  }

  _cross(x, y, height) {
    this.context.lineWidth = this.symbolWidth + 3;
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(x - this.symbolWidth/2, y + height / 2);
    this.context.lineTo(x + this.symbolWidth/2 + height, y + height / 2);
    this.context.moveTo(x + height /2, y - this.symbolWidth/2);
    this.context.lineTo(x + height /2, y + this.symbolWidth/2 + height);
  }

  /// Draws a symbol based on the number
  _drawSymbol(x, y, height, number) {
    x += this.marginY - (this.height / 2);
    y += this.marginX - (this.height / 2);
    if (number === '0') {
      this._line(x, y, height)
    } else {
      switch (this.symbols) {
        case 'squares':
          if (number === '1') {
            this._square(x, y, height)
          } else if (number === '2') {
            this._fillSquare(x, y, height);
          } else if (number === '3') {
            this._squareLine(x, y, height);
          } else if (number === '4') {
            this._squarePoint(x, y, height);
          }
          break;
        case 'triangles':
          if (number === '1') {
            this._triangle(x, y, height)
          } else if (number === '2') {
            this._fillTriangle(x, y, height);
          } else if (number === '3') {
            this._triangleLine(x, y, height);
          } else if (number === '4') {
            this._trianglePoint(x, y, height);
          }
          break;
        case 'circles':
          if (number === '1') {
            this._circle(x, y, height)
          } else if (number === '2') {
            this._fillCircle(x, y, height);
          } else if (number === '3') {
            this._circleLine(x, y, height);
          } else if (number === '4') {
            this._circlePoint(x, y, height);
          }
          break;
      }
    }

    this.previousX = x;
    this.previousY = y;
  }

  _circleX(angulo, raio) { return raio * Math.cos(Math.PI * angulo / 180.0) };
  _circleY(angulo, raio) { return raio * Math.sin(Math.PI * angulo / 180.0) };

  _outlineCircle(sequence) {
		const radius = this.symbolMargin;
		const quantity = sequence.length + 1;
    const espacoAngulo = 360 / quantity;
		let ultimoAngulo = 0;
		for (var i = 0; i < quantity; i++) {
			const x = this._circleX(ultimoAngulo, radius) + radius;
			const y = this._circleY(ultimoAngulo, radius) + radius;
      
      this._drawSymbol(x, y, this.symbolHeight || 10, sequence[i]);
      
			this.context.stroke();
			ultimoAngulo += espacoAngulo;
	  }
	}

  _outlineTriangle(sequence) {
    let tamanho = Math.floor(sequence.length / 3) + 2;
	  let x = 0;
	  let y = 10;
	  let contador1 = 0;
	  let contador2 = 0;
	  for (var i = 0; i < sequence.length; i++) {
			if (contador2 === 0) {
				x += this.symbolMargin;
			} else if (contador2 === 1) {
				y += this.symbolMargin;
				x -= this.symbolMargin / 2;
			} else {
				y -= this.symbolMargin;
				x -= this.symbolMargin / 2;
      }
      
      contador1++;
      if (contador1 === tamanho) {
        contador1 = 0;
				contador2++;
        i--;
        continue;
      }

			this._drawSymbol(x, y, this.symbolHeight || 10, sequence[i]);
      
      this.context.stroke();
	  }
  }

  _squareHeight(quantity) {
    const average = this.height / quantity
    return average - (average / 1.6);
  }

  _outlineSquare(sequence) {
    let quantityItemsSide = Math.floor(sequence.length / 4) + 1;
    const symbolHeight = this.symbolHeight || Math.floor(this._squareHeight(quantityItemsSide));
    let x = 0;
    let y = 10;
    let contador1 = 0;
    let contador2 = 0;
    for (var i = 0; i < sequence.length; i++) {
      if (contador2 === 0) {
        x += this.symbolMargin;
      } else if (contador2 === 1) {
        y += this.symbolMargin;
      } else if (contador2 === 2) {
        x -= this.symbolMargin;
      } else {
        y -= this.symbolMargin;
      }
      
      this._drawSymbol(x, y, symbolHeight, sequence[i]);

      this.context.stroke();
      contador1++;
      if (contador1 === quantityItemsSide) {
        contador1 = 0;
        contador2++;
      }
    }
  }
}

class Encoder {
  constructor() {
    this.URL_SHORTENER = 'https://cgrco.de/';

    this.numericTable = {
      none: '00',
      0: '01',
      1: '02',
      2: '03',
      3: '10',
      4: '11',
      5: '12',
      6: '13',
      7: '20',
      8: '21',
      9: '22',
      '+': '23',
      '-': '30',
      '.': '31',
      '/': '32',
      '_': '33'
    }

    this.alphaNumericTable = {
      0: '000',
      1: '001',
      2: '002',
      3: '003',
      4: '010',
      5: '011',
      6: '012',
      7: '013',
      '.': '020',
      8: '021',
      9: '022',
      a: '023',
      b: '030',
      c: '031',
      d: '032',
      e: '033',
      f: '100',
      g: '101',
      h: '102',
      i: '103',
      j: '110',
      k: '111',
      l: '112',
      m: '113',
      n: '120',
      o: '121',
      p: '122',
      q: '123',
      r: '130',
      s: '131',
      t: '132',
      u: '133',
      v: '200',
      w: '201',
      x: '202',
      y: '203',
      z: '210',
      A: '211',
      B: '212',
      C: '213',
      D: '220',
      E: '221',
      F: '222',
      G: '223',
      H: '230',
      I: '231',
      J: '232',
      K: '233',
      L: '300',
      M: '301',
      N: '302',
      O: '303',
      P: '310',
      Q: '311',
      R: '312',
      S: '313',
      T: '320',
      U: '321',
      V: '322',
      W: '323',
      X: '330',
      Y: '331',
      Z: '332',
      '/': '333'
    }
  }

  encode(data, urlShortener = '') {
    if (urlShortener) {
      this.URL_SHORTENER = urlShortener;
    }

    let codeString = '';
    let parsedData = '';
    if (data.toLowerCase().startsWith('http://')) {
      codeString += '1';
      parsedData = data.substr(7);
    } else if (data.toLowerCase().startsWith('https://')) {
      if (data.toLowerCase().startsWith(this.URL_SHORTENER)) {
        codeString += '3';
        parsedData = data.substr(this.URL_SHORTENER.length);
      } else {
        codeString += '2';
        parsedData = data.substr(8);
      }
    } else {
      codeString += '0';
      parsedData = data;
    }

    if (parsedData.match(/^[0-9]+$/g)) {
      codeString += '0';
    } else if (parsedData.match(/^[0-9a-zA-Z\./]+$/g)) {
      codeString += '1';
    } else if (/[^\u0000-\u00ff]/.test(parsedData)) {
      //Neste caso contém unicode
      codeString += '3';
    } else {
      codeString += '2';
    }

    codeString += this._textToNumber(parsedData, codeString[1]);
    
    return codeString
  }

  _textToNumber(text, encoding) {
    let returnString = '';
    text = this._pad(text, encoding);
    if (encoding === '0') {
      for (let char of text) {
        returnString += this.numericTable[char];
      }
    } else if (encoding === '1') {
      for (let char of text) {
        returnString += this.alphaNumericTable[char];
      }
    } else {
      return text.split('').map((char) => '00'.concat(char.charCodeAt(0).toString(4)).slice(-6)).join('');
    }

    return returnString;
  }

  _pad(text, encoding) {
    let pad = '';
    if (encoding === '0') {
      pad = '000000000000000';
    } else if (encoding === '1') {
      pad = '..........';
    } else {
      pad = '....';
    }

    return pad.substr(0, pad.length - text.length) + text;
  }
}
