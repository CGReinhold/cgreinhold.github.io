class CGRCode {
  constructor({ 
    text = '', // OK
    height = 300, // Serve pra nada
    color = '#000000', // OK
    backgroundColor = '#FFFFFF', // OK
    marginX = 50, // OK
    marginY = 50, // OK
    shape = 'circle',
    symbols = 'triangles', // OK
    symbolHeight = null, // OK
    symbolMargin = null, // OK
    image = undefined,
    imageXMargin = 0,
    imageYMargin = 0,
    imageHeight = 100,
    imageWidth = 100,
    style = ''
  }) {
    this.text = text;
    this.height = height;
    this.color = color;
    this.backgroundColor = backgroundColor;
    this.marginX = marginX;
    this.marginY = marginY;
    this.shape = shape;
    this.symbols = symbols;
    this.symbolHeight = symbolHeight;
    this.symbolMargin = symbolMargin;
    this.image = image;
    this.imageXMargin = imageXMargin;
    this.imageYMargin = imageYMargin;
    this.imageHeight = imageHeight;
    this.imageWidth = imageWidth;
    this.style = style;
  }

  _textToNumber(text) {
    if (text && text.length < 5) {
      text = '00000'.concat(text).slice(-5);
    }
    return text.split('').map((char) => '00'.concat(char.charCodeAt(0).toString(3)).slice(-6)).join('');
  };

  generate(divID) {
    const canvas = document.createElement('canvas');
    canvas.id = "cgrcode";
    canvas.width = this.height;
    canvas.height = this.height;
    canvas.style.position = "absolute";
    canvas.style = this.style;

    const div = document.getElementById(divID);
    div.innerHTML = '';
    div.appendChild(canvas);

    this.context = canvas.getContext('2d');
    this.context.clearRect(0, 0, this.height, this.height);
    this.context.fillStyle = this.backgroundColor;
    this.context.fillRect(0, 0, canvas.width, canvas.height);

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

    if (this.image) {
      var image = new Image();
      image.src = this.image;

      image.onload = () => this.context.drawImage(image, this.imageXMargin, this.imageYMargin, this.imageWidth, this.imageHeight);
    }
  }

  /// Symbols
  /// The folowing symbols are currently implemented:
  /// Square, Filled Square, Circle, Filled Circle, Triangle, Filled Triangle, Line, Cross
  
  _square(x, y, height) {
    this.context.strokeStyle = this.color;
    this.context.rect(x, y, height, height);
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

  _fillCircle(x, y, height) {
    this._circle(x, y, height);
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
    
    this.context.lineWidth = 1;
    this.context.strokeStyle = this.color;
    this.context.stroke();
  }

  _fillTriangle(x, y, height) {
    this._triangle(x, y, height)
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  _angle(xA, yA, xB, yB) {
    return Math.atan((yB - yA) / (xB - xA)) * (180 / Math.PI);
  }

  _line(x, y, height) {
    // const angle = this._angle(x, y, this.previousX, this.previousY);
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(x, y + height / 2);
    this.context.lineTo(x + height, y + height / 2);
    // this.context.moveTo(x, y);
    // this.context.lineTo(x + height * Math.sin(angle), y + height * Math.cos(angle));
  }

  _cross(x, y, height) {
    this.context.lineWidth = 2;
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    this.context.moveTo(x, y + height / 2);
    this.context.lineTo(x + height, y + height / 2);
    this.context.moveTo(x + height /2, y);
    this.context.lineTo(x + height /2, y + height);
  }

  /// Draws a symbol based on the number
  _drawSymbol(x, y, height, number) {
    x += this.marginY;
    y += this.marginX;
    if (number === '4') {
      this._cross(x, y, height)
    } else if (number === '0') {
      this._line(x, y, height)
    } else {
      switch (this.symbols) {
        case 'squares':
          if (number === '1') {
            this._square(x, y, height)
          } else {
            this._fillSquare(x, y, height);
          }
          break;
        case 'triangles':
          if (number === '1') {
            this._triangle(x, y, height)
          } else {
            this._fillTriangle(x, y, height);
          }
          break;
        case 'circles':
          if (number === '1') {
            this._circle(x, y, height)
          } else {
            this._fillCircle(x, y, height);
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
		const raio = 200;
		const qtd = sequence.length;
		const espacoAngulo = Math.round(360 / qtd);
		let ultimoAngulo = 0;
		for (var i = 0; i < qtd; i++) {
			const x = this._circleX(ultimoAngulo, raio) + raio;
			const y = this._circleY(ultimoAngulo, raio) + raio;
      
      this._drawSymbol(x, y, this.symbolHeight || 10, sequence[i]);
      
			this.context.stroke();
			ultimoAngulo += espacoAngulo;
	  }
	}

  _outlineTriangle(sequence) {
    let tamanho = Math.floor(sequence.length / 3) + 1;
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
      
			this._drawSymbol(x, y, this.symbolHeight || 10, sequence[i]);
      
      this.context.stroke();
			contador1++;
			if (contador1 == tamanho) {
				contador1 = 0;
				contador2++;
			}
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