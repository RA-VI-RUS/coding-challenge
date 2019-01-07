$(document).ready(function() {
  
  var Game = {
    
    human: '',
    computer: '',
    grid: [['','',''],['','',''],['','','']],
    NINF: Number.NEGATIVE_INFINITY,
    PINF: Number.POSITIVE_INFINITY,
    restart_delay: 3250,
    fade_delay: 500,
    current_state: 'initialize',

    initialize: function() {
      $('td').off();
      this.human = '';
      this.computer = '';
      this.grid = [['','',''],['','',''],['','','']];
      this.show_grid();
      this.next_state('token_prompt');
      this.token_prompt();
    },
    
    show_selectors: function() {
      $('.selectors').hide();
      $('.selectors').html("Click <span id=selector-x>X</span> or ");
      $('.selectors').append("<span id=selector-o>O</span> to start");
      $('.selectors').fadeIn(this.fade_delay);
    },
    
    token_prompt: function() {
      var game = this;
      if(this.is_state('token_prompt')) {
        game.show_selectors();
        $('#selector-x').on('click', function() {
          game.human = 'X';
          game.computer = 'O';
          $('.selectors').fadeOut(game.fade_delay);
          game.next_state('enable_move');
          game.enable_move();
        })
        $('#selector-o').click(function() {
          game.human = 'O';
          game.computer = 'X';
          $('.selectors').fadeOut(game.fade_delay);
          game.next_state('enable_move');
          game.enable_move();
        })
      }
    },
    
    get_rc: function(id) {
      var rc = {};
      rc.row = +(id.charAt(0));
      rc.col = +(id.charAt(1));
      return rc;
    },
    
    enable_move: function() {
      var game = this;
      $('td').click(function() {
        if(game.is_state('enable_move')) {
          var rc = game.get_rc($(this).attr('id'));
          game.grid[rc.row][rc.col] = game.human;
          game.show_grid();
          game.next_state('eval_move');
          game.eval_move(false);
        }
      })
    },
    
    get_response: function() {
      if(this.is_state('get_response')) {
        var rc = this.negamax(this.NINF, this.PINF, 1);
        this.grid[rc.row][rc.col] = this.computer;
        this.show_grid();
        this.next_state('eval_move');
        this.eval_move(true);
      }
    },
    
    eval_move: function(computers_move) {
      if(this.is_state('eval_move')) {
        if(!this.game_over()) {
          this.next_move(computers_move);
          return;
        } else if(this.wins(this.computer)) {
          $('.selectors').html("I won").fadeIn(this.fade_delay);
        } else if(this.wins(this.human)) {
          $('.selectors').html("You won").fadeIn(this.fade_delay);
        } else if(this.filled()) {
          $('.selectors').html("It's a tie").fadeIn(this.fade_delay);
        }
        this.next_state('restart');
        this.restart();
      }
    },
    
    next_move: function(computers_move) {
      if(computers_move) {
        this.next_state('enable_move');
      } else {
        this.next_state('get_response');
        this.get_response();
      }
    },
    
    restart: function() {
      if(this.is_state('restart')) {
        var game = this;
        $('.results').fadeOut(game.fade_delay);
        game.next_state('initialize');
        setTimeout(function() { game.initialize(); }, game.restart_delay);
      }
    },
    
    is_state: function(state) {
      return this.current_state === state;
    },
    
    next_state: function(state) {
      this.current_state = state;
    },
        
    winners: [
      [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
      [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
      [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
      [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
      [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
      [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
    ],
    
    wins: function(token) {
      return this.winners.some(function(row) {
        return row.every(function(rc) {
          return this.grid[rc.row][rc.col] === token;
        }, this)
      }, this)
    },
    
    winner: function() {
      return this.wins(this.computer) || this.wins(this.human);
    },
    
    filled: function() {
      return (this.possible_moves().length === 0);
    },
    
    game_over: function() {
      return this.winner() || this.filled();
    },
    
    possible_moves: function() {
      var moves = [];
      return this.grid.reduce(function(moves, row, r) {
        return row.reduce(function(moves, cell, c) {
          if(cell !== 'X' && cell !== 'O') {
            var rc = { row: r, col: c};
            moves.push(rc);
            return moves;
          } else {
            return moves;
          }
        }, moves)
      }, moves)
    },
    
    show_grid: function() {
      this.grid.forEach(function(row, r) {
        row.forEach(function(cell, c) {
          $('#' + r + c).html(cell);
        })
      })
    },
    
    score: function() {
      if(this.wins(this.computer))
        return +1;
      if(this.wins(this.human))
        return -1;
      return 0;
    },
    
    negamax: function(alpha, beta, turn) {
      
      var new_moves = this.possible_moves();
      var best_move = { score: this.NINF, row: -1, col: -1 };
      
      if(new_moves.length == 0 || this.winner()) {
        best_move.score = turn * this.score();
        return best_move;
      }

      new_moves.some(function(rc) {
        this.grid[rc.row][rc.col] = (turn > 0) ? this.computer : this.human;
        var v = this.negamax(-beta, -alpha, -turn);
        if(v.score < -best_move.score)
          best_move = { score: -v.score, row: rc.row, col: rc.col };
        alpha = Math.max(alpha, best_move.score);
        if(beta <= alpha) {
          this.grid[rc.row][rc.col] = '';
          return true; 
        }
        this.grid[rc.row][rc.col] = '';
      }, this);
      return best_move;
    }
  }

  var game = Object.create(Game);
  game.initialize();
  
})
