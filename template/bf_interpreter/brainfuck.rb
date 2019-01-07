require_relative './environment'
require 'io/console'
require 'stringio'
require 'strscan'

class Brainfuck
  def initialize(input: $stdin, output: $stdout)
    $stdin = input
    $stdout = output
  end

  def interpret!(script)
    buffer = StringScanner.new(script)
    tokens = []
    stack = []
    data = [0] * 30000
    iPtr = 0
    dPtr = 0
    left_count = 0

    while !buffer.eos? do
      token = buffer.scan_until(/\+|-|>|<|\[|\]|\.|,/)
      left_count += 1 if token === '['
      left_count -= 1 if token === ']'
      if left_count < 0 
        $stderr.puts "Error - Missing [ bracket"
        return
      end
      tokens.push(token)
    end

    if left_count > 0 
      $stderr.puts "Error - Missing ] bracket"
      return
    end

    while iPtr < tokens.length do
      case tokens[iPtr]
      when '+'
        data[dPtr] += 1
      when '-'
        data[dPtr] -= 1
      when '>'
        dPtr += 1
      when '<'
        dPtr -= 1
      when '.'
        $stdout.print data[dPtr].chr
      when ','
        data[dPtr] = $stdin.getch()
      when '['
        stack.push(iPtr)
      when ']'
        iPtr = stack[-1] if data[dPtr] != 0
        stack.pop() if data[dPtr] == 0
      end

      iPtr += 1
    end
  ensure
    $stdin = STDIN
    $stdout = STDOUT
  end
end
