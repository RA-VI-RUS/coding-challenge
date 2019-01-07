require 'test/unit'
require 'minitest/autorun'

require_relative './environment'
require_relative './brainfuck'

class TestBrainfuck < Test::Unit::TestCase
  def setup
    @out = StringIO.new
    @interpreter = Brainfuck.new(input: $stdin, output: @out)
  end

  def test_hello_world
    script = "++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++."
    output = "Hello World!\n"
    assert_script_output script, output
  end

  private

  def assert_script_output(script, output)
    @interpreter.interpret!(script)
    assert_equal(output, @out.string)
  end
end


describe Brainfuck do
  before do
    @out = StringIO.new
    @interpreter = Brainfuck.new(input: $stdin, output: @out)
  end

  it 'parses all commands and reads a character from $stdin' do
    script = '+-><[],.'
    assert_output('A') do
      $stdin = StringIO.new
      $stdin.puts 'A'
      $stdin.rewind
      @interpreter.interpret!(script)
      $stdin = STDIN
    end
  end

  it 'generates left bracket error' do
    script = ']'
    assert_output(nil, /Error - Missing \[ bracket/) do
      @interpreter.interpret!(script)
    end
  end

  it 'generates right bracket error' do
    script = '['
    assert_output(nil, /Error - Missing \] bracket/) do
      @interpreter.interpret!(script)
    end
  end

  it 'calculates 2 + 5 and converts result to ASCII' do
    script = '++>+++++[<+>-]++++++++[<++++++>-]<.'
    assert_output('7') { @interpreter.interpret!(script) }
  end

  it 'prints Hello World!' do
    script = '++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++.'
    @interpreter.interpret!(script)
    assert_output(/\AHello World!\n\z/) { @interpreter.interpret!(script) }
  end
end