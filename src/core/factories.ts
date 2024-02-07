// factories to create new instances of objects
class Factories {
  public static createFactory<T>(type: { new (): T }): T {
    return new type();
  }
}