export const cppCode = `\
#include<iostream>
#include<stdint.h>
#include<limits>

constexpr auto f(uint64_t const& x) -> uint64_t {
    return x < 2 ? x : f(x - 1) + f(x - 2);
}

constexpr auto g(uint64_t const& x) -> uint64_t {
    return x == 0 ? 1 : x * g(x - 1);
}

constexpr auto g30() -> uint64_t {
  return g(30);
}

auto delta(uint64_t const& old_v, uint64_t const& new_v) -> uint64_t{
    return new_v - old_v;
}
`;

export const notCppCode = `\
def f(x):
    return x * x + x

def main():
    print(f(20))
`;
