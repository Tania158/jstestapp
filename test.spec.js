// Mocking the sqlite3 module
jest.mock("sqlite3", () => ({
  Database: jest.fn().mockImplementation(() => ({
    run: jest.fn(),
    get: jest.fn(),
    all: jest.fn(),
    close: jest.fn(),
  })),
}));

const sqlite3 = require("sqlite3");

describe("API Tests", () => {
  let db;

  beforeAll(() => {
    db = new sqlite3.Database();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock functions
  const createProduct = async (newProduct) => {
    return db.run(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      newProduct.name,
      newProduct.price
    );
  };

  const getAllProducts = async () => {
    return db.all("SELECT * FROM products");
  };

  const getProductById = async (productId) => {
    return db.get("SELECT * FROM products WHERE id = ?", productId);
  };

  const updateProduct = async (productId, updatedProduct) => {
    return db.run(
      "UPDATE products SET name = ?, price = ? WHERE id = ?",
      updatedProduct.name,
      updatedProduct.price,
      productId
    );
  };

  const deleteProduct = async (productId) => {
    return db.run("DELETE FROM products WHERE id = ?", productId);
  };

  it("should create a new product", async () => {
    const newProduct = { name: "New Product", price: 100 };
    await createProduct(newProduct);
    expect(db.run).toHaveBeenCalledWith(
      "INSERT INTO products (name, price) VALUES (?, ?)",
      newProduct.name,
      newProduct.price
    );
  });

  it("should get all products", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", price: 10 },
      { id: 2, name: "Product 2", price: 20 },
    ];
    db.all.mockResolvedValue(mockProducts);
    const products = await getAllProducts();
    expect(products).toEqual(mockProducts);
  });

  it("should get a product by id", async () => {
    const productId = 1;
    const mockProduct = { id: productId, name: "Product 1", price: 10 };
    db.get.mockResolvedValue(mockProduct);
    const product = await getProductById(productId);
    expect(product).toEqual(mockProduct);
  });

  it("should update a product by id", async () => {
    const productId = 1;
    const updatedProduct = {
      id: productId,
      name: "Updated Product",
      price: 50,
    };
    await updateProduct(productId, updatedProduct);
    expect(db.run).toHaveBeenCalledWith(
      "UPDATE products SET name = ?, price = ? WHERE id = ?",
      updatedProduct.name,
      updatedProduct.price,
      productId
    );
  });

  it("should delete a product by id", async () => {
    const productId = 1;
    await deleteProduct(productId);
    expect(db.run).toHaveBeenCalledWith(
      "DELETE FROM products WHERE id = ?",
      productId
    );
  });
});
