function lineIntersectsRectangle(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Проверяем, пересекает ли отрезок границы прямоугольника
  if (x1 < rx && x2 < rx || x1 > rx + rw && x2 > rx + rw || y1 < ry && y2 < ry || y1 > ry + rh && y2 > ry + rh) {
    return false;
  }

  // Проверяем, пересекает ли отрезок вершины прямоугольника
  let intersectionX, intersectionY;

  if (x1 < rx) {
    intersectionX = rx;
    intersectionY = y1 + (y2 - y1) * (rx - x1) / (x2 - x1);
    if (intersectionY > ry && intersectionY < ry + rh) {
      return { x: intersectionX, y: intersectionY };
    }
  } else if (x1 > rx + rw) {
    intersectionX = rx + rw;
    intersectionY = y1 + (y2 - y1) * (rx + rw - x1) / (x2 - x1);
    if (intersectionY > ry && intersectionY < ry + rh) {
      return { x: intersectionX, y: intersectionY };
    }
  }

  if (y1 < ry) {
    intersectionX = x1 + (x2 - x1) * (ry - y1) / (y2 - y1);
    intersectionY = ry;
    if (intersectionX > rx && intersectionX < rx + rw) {
      return { x: intersectionX, y: intersectionY };
    }
  } else if (y1 > ry + rh) {
    intersectionX = x1 + (x2 - x1) * (ry + rh - y1) / (y2 - y1);
    intersectionY = ry + rh;
    if (intersectionX > rx && intersectionX < rx + rw) {
      return { x: intersectionX, y: intersectionY };
    }
  }

  return false;
}

function lineIntersectsSphere(x1, y1, x2, y2, cx, cy, r) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  let fx = x1 - cx;
  let fy = y1 - cy;

  let a = dx * dx + dy * dy;
  let b = 2 * (fx * dx + fy * dy);
  let c = fx * fx + fy * fy - r * r;

  let discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return false;
  }

  // Расчитываем точки пересечения отрезка с окружностью
  discriminant = Math.sqrt(discriminant);
  let t1 = (-b - discriminant) / (2 * a);
  let t2 = (-b + discriminant) / (2 * a);

  if (t1 >= 0 && t1 <= 1) {
    let ix1 = x1 + dx * t1;
    let iy1 = y1 + dy * t1;
    return { x: ix1, y: iy1 };
  }

  if (t2 >= 0 && t2 <= 1) {
    let ix2 = x1 + dx * t2;
    let iy2 = y1 + dy * t2;
    return { x: ix2, y: iy2 };
  }

  return false;
}
