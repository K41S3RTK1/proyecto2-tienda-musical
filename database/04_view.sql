CREATE OR REPLACE VIEW vista_reporte_ventas AS
SELECT
    v.id_venta,
    v.fecha,
    CONCAT(c.nombre, ' ', c.apellido) AS cliente,
    CONCAT(e.nombre, ' ', e.apellido) AS empleado,
    v.metodo_pago,
    v.estado,
    v.total
FROM venta v
INNER JOIN cliente c ON v.id_cliente = c.id_cliente
INNER JOIN empleado e ON v.id_empleado = e.id_empleado;