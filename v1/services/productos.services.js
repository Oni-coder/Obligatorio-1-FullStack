import Producto from "../models/producto.model.js";

export const obtenerProductosService = async () => {
    const productos = await Producto.find();
    return productos;
}

export const obtenerProductoService = async (id) => {
    const producto = await Producto.findById(id);
    return producto;
}

export const crearProductoService = async (producto) => {
    let nuevoProducto = new Producto(producto);
    await nuevoProducto.save();
    return nuevoProducto;
}

export const actualizarProductoService = async (id, producto) => {
    let productoActualizado = await Producto.findByIdAndUpdate(id, producto, { returnDocument: "after" });
    return productoActualizado;
}

export const eliminarProductoService = async (id) => {
    const productoEliminado = await Producto.findByIdAndDelete(id);
    return productoEliminado;
}

export const obtenerProductosPorRangoPrecioService = async (min, max) => {
    const productos = await Producto.find({ precio: { $gte: min, $lte: max } });
    return productos;
}