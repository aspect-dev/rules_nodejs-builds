"use strict";
// tslint:disable
function setWithStringLiteral() {
    const set = new Set('abc');
}
function setWithStringVariable(s) {
    const set = new Set(s);
}
function setWithStringUnionType(s) {
    const set = new Set(s);
}
function setWithStringExpression(fn) {
    const set = new Set(fn());
}
function setWithStringExpression2() {
    const set = new Set(Math.random() < 0.5 ? 'a' : 'b');
}
function setWithComplexInitializationType(s) {
    const set = new Set(s);
}
function setWithUnionStringType(s) {
    const set = new Set(s);
}
function setWithLocalAlias() {
    const TotallyNotASet = Set;
    const set = new TotallyNotASet('abc');
}
function setWithMultipleAliases() {
    const Foo = Set;
    const Bar = Foo;
    const Baz = Bar;
    const set = new Baz('abc');
}
function setUsingSetConstructorType(ctor) {
    const set = new ctor('abc');
}
function setUsingAliasedSetConstructor(ctor) {
    const set = new ctor('abc');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpdmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvYnVpbGRfYmF6ZWxfcnVsZXNfdHlwZXNjcmlwdC9pbnRlcm5hbC90c2V0c2UvdGVzdHMvYmFuX3N0cmluZ19pbml0aWFsaXplZF9zZXRzL3Bvc2l0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBQWlCO0FBQ2pCLFNBQVMsb0JBQW9CO0lBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxTQUFTLHFCQUFxQixDQUFDLENBQVM7SUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELFNBQVMsc0JBQXNCLENBQUMsQ0FBa0I7SUFDaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELFNBQVMsdUJBQXVCLENBQUMsRUFBZ0I7SUFDL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBRUQsU0FBUyx3QkFBd0I7SUFDL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBSUQsU0FBUyxnQ0FBZ0MsQ0FBQyxDQUFRO0lBQ2hELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFFRCxTQUFTLHNCQUFzQixDQUFDLENBQThCO0lBQzVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFFRCxTQUFTLGlCQUFpQjtJQUN4QixNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUM7SUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELFNBQVMsc0JBQXNCO0lBQzdCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNoQixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDaEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxTQUFTLDBCQUEwQixDQUFDLElBQW9CO0lBQ3RELE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFHRCxTQUFTLDZCQUE2QixDQUFDLElBQVc7SUFDaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlXG5mdW5jdGlvbiBzZXRXaXRoU3RyaW5nTGl0ZXJhbCgpIHtcbiAgY29uc3Qgc2V0ID0gbmV3IFNldCgnYWJjJyk7XG59XG5cbmZ1bmN0aW9uIHNldFdpdGhTdHJpbmdWYXJpYWJsZShzOiBzdHJpbmcpIHtcbiAgY29uc3Qgc2V0ID0gbmV3IFNldChzKTtcbn1cblxuZnVuY3Rpb24gc2V0V2l0aFN0cmluZ1VuaW9uVHlwZShzOiBzdHJpbmd8c3RyaW5nW10pIHtcbiAgY29uc3Qgc2V0ID0gbmV3IFNldChzKTtcbn1cblxuZnVuY3Rpb24gc2V0V2l0aFN0cmluZ0V4cHJlc3Npb24oZm46ICgpID0+IHN0cmluZykge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0KGZuKCkpO1xufVxuXG5mdW5jdGlvbiBzZXRXaXRoU3RyaW5nRXhwcmVzc2lvbjIoKSB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQoTWF0aC5yYW5kb20oKSA8IDAuNSA/ICdhJyA6ICdiJyk7XG59XG5cbnR5cGUgVHlwZUEgPSBzdHJpbmd8U2V0PHN0cmluZz47XG50eXBlIFR5cGVCID0gVHlwZUF8KEl0ZXJhYmxlPHN0cmluZz4mSXRlcmFibGVJdGVyYXRvcjxzdHJpbmc+KTtcbmZ1bmN0aW9uIHNldFdpdGhDb21wbGV4SW5pdGlhbGl6YXRpb25UeXBlKHM6IFR5cGVCKSB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQocyk7XG59XG5cbmZ1bmN0aW9uIHNldFdpdGhVbmlvblN0cmluZ1R5cGUoczogc3RyaW5nJnt0b1N0cmluZygpOiBzdHJpbmd9KSB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQocyk7XG59XG5cbmZ1bmN0aW9uIHNldFdpdGhMb2NhbEFsaWFzKCkge1xuICBjb25zdCBUb3RhbGx5Tm90QVNldCA9IFNldDtcbiAgY29uc3Qgc2V0ID0gbmV3IFRvdGFsbHlOb3RBU2V0KCdhYmMnKTtcbn1cblxuZnVuY3Rpb24gc2V0V2l0aE11bHRpcGxlQWxpYXNlcygpIHtcbiAgY29uc3QgRm9vID0gU2V0O1xuICBjb25zdCBCYXIgPSBGb287XG4gIGNvbnN0IEJheiA9IEJhcjtcbiAgY29uc3Qgc2V0ID0gbmV3IEJheignYWJjJyk7XG59XG5cbmZ1bmN0aW9uIHNldFVzaW5nU2V0Q29uc3RydWN0b3JUeXBlKGN0b3I6IFNldENvbnN0cnVjdG9yKSB7XG4gIGNvbnN0IHNldCA9IG5ldyBjdG9yKCdhYmMnKTtcbn1cblxudHlwZSBNeVNldCA9IFNldENvbnN0cnVjdG9yO1xuZnVuY3Rpb24gc2V0VXNpbmdBbGlhc2VkU2V0Q29uc3RydWN0b3IoY3RvcjogTXlTZXQpIHtcbiAgY29uc3Qgc2V0ID0gbmV3IGN0b3IoJ2FiYycpO1xufVxuIl19