"use strict";
// tslint:disable
function emptySet() {
    const set = new Set();
}
function noConstructorArgs() {
    const set = new Set;
}
function nonStringSet() {
    const set = new Set([1, 2, 3]);
}
// This is an allowable way to create a set of strings
function setOfStrings() {
    const set = new Set(['abc']);
}
function setOfChars() {
    const set = new Set('abc'.split(''));
}
function explicitlyAllowString() {
    const set = new Set('abc');
}
// checks that just a property called 'Set' doesn't trigger the error
function justAKeyCalledSet(obj) {
    const set = new obj.Set('abc');
}
function destructuredConstructorCalledSet(obj) {
    const { Set } = obj;
    const set = new Set('abc');
}
function locallyDeclaredSet() {
    class Set {
        constructor(s) {
            this.s = s;
        }
    }
    const set = new Set('abc');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVnYXRpdmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vZXh0ZXJuYWwvYnVpbGRfYmF6ZWxfcnVsZXNfdHlwZXNjcmlwdC9pbnRlcm5hbC90c2V0c2UvdGVzdHMvYmFuX3N0cmluZ19pbml0aWFsaXplZF9zZXRzL25lZ2F0aXZlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaUJBQWlCO0FBQ2pCLFNBQVMsUUFBUTtJQUNmLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDeEIsQ0FBQztBQUVELFNBQVMsaUJBQWlCO0lBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO0FBQ3RCLENBQUM7QUFFRCxTQUFTLFlBQVk7SUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELHNEQUFzRDtBQUN0RCxTQUFTLFlBQVk7SUFDbkIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxTQUFTLFVBQVU7SUFDakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLHFCQUFxQjtJQUM1QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUF5QixDQUFDLENBQUM7QUFDakQsQ0FBQztBQUVELHFFQUFxRTtBQUNyRSxTQUFTLGlCQUFpQixDQUFDLEdBQWtDO0lBQzNELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsU0FBUyxnQ0FBZ0MsQ0FBQyxHQUFrQztJQUMxRSxNQUFNLEVBQUMsR0FBRyxFQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ2xCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxTQUFTLGtCQUFrQjtJQUN6QixNQUFNLEdBQUc7UUFDUCxZQUFvQixDQUFTO1lBQVQsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFHLENBQUM7S0FDbEM7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gdHNsaW50OmRpc2FibGVcbmZ1bmN0aW9uIGVtcHR5U2V0KCkge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0KCk7XG59XG5cbmZ1bmN0aW9uIG5vQ29uc3RydWN0b3JBcmdzKCkge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0O1xufVxuXG5mdW5jdGlvbiBub25TdHJpbmdTZXQoKSB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQoWzEsIDIsIDNdKTtcbn1cblxuLy8gVGhpcyBpcyBhbiBhbGxvd2FibGUgd2F5IHRvIGNyZWF0ZSBhIHNldCBvZiBzdHJpbmdzXG5mdW5jdGlvbiBzZXRPZlN0cmluZ3MoKSB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQoWydhYmMnXSk7XG59XG5cbmZ1bmN0aW9uIHNldE9mQ2hhcnMoKSB7XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQoJ2FiYycuc3BsaXQoJycpKTtcbn1cblxuZnVuY3Rpb24gZXhwbGljaXRseUFsbG93U3RyaW5nKCkge1xuICBjb25zdCBzZXQgPSBuZXcgU2V0KCdhYmMnIGFzIEl0ZXJhYmxlPHN0cmluZz4pO1xufVxuXG4vLyBjaGVja3MgdGhhdCBqdXN0IGEgcHJvcGVydHkgY2FsbGVkICdTZXQnIGRvZXNuJ3QgdHJpZ2dlciB0aGUgZXJyb3JcbmZ1bmN0aW9uIGp1c3RBS2V5Q2FsbGVkU2V0KG9iajoge1NldDoge25ldyAoczogc3RyaW5nKTogYW55fX0pIHtcbiAgY29uc3Qgc2V0ID0gbmV3IG9iai5TZXQoJ2FiYycpO1xufVxuXG5mdW5jdGlvbiBkZXN0cnVjdHVyZWRDb25zdHJ1Y3RvckNhbGxlZFNldChvYmo6IHtTZXQ6IHtuZXcgKHM6IHN0cmluZyk6IGFueX19KSB7XG4gIGNvbnN0IHtTZXR9ID0gb2JqO1xuICBjb25zdCBzZXQgPSBuZXcgU2V0KCdhYmMnKTtcbn1cblxuZnVuY3Rpb24gbG9jYWxseURlY2xhcmVkU2V0KCkge1xuICBjbGFzcyBTZXQge1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgczogc3RyaW5nKSB7fVxuICB9XG4gIGNvbnN0IHNldCA9IG5ldyBTZXQoJ2FiYycpO1xufVxuIl19