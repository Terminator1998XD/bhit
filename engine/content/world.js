class Dim {
  constructor(background) {
    this.map = [];
    this.background = background;
  }

  addGameObject(obj) {
    const z = obj.pos.z;
    const n = this.map.length;
    let i = 0;

    for (; i < n; i++) {
      if (this.map[i].pos.z >= z) {
        break;
      }
    }

    if (i === n) {
      this.map.push(obj);
    } else if (i === 0) {
      this.map.unshift(obj);
    } else {
      this.map.splice(i, 0, obj);
    }
  }

  addGameObjectYSort(pool) {
    const plen = pool.length;
    for (let i = 0; i < plen; i++) {
      for (let j = 0; j < plen- 1 - i; j++) {
        // Проверяем, больше ли текущий элемент, чем следующий
        if (pool[j].pos.y > pool[j + 1].pos.y) {
          // Если да, меняем их местами
          const temp = pool[j];
          pool[j] = pool[j + 1];
          pool[j + 1] = temp;
        }
      }
    }

    this.map.push(...pool);
  }

  addGameObjectRange(range, z) {
    const n = this.map.length;
    let i = 0;

    for (; i < n; i++) {
      if (this.map[i].pos.z >= z) {
        break;
      }
    }

    if (i === n) {
      this.map.push(...range);
    } else if (i === 0) {
      this.map.unshift(...range);
    } else {
      this.map.splice(i, 0, ...range);
    }
  }
}
