CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_venta_fecha ON venta(fecha);
CREATE INDEX idx_detalle_venta_producto ON detalle_venta(id_producto);