{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
    # sops-nix.url = "github:mic92/sops-nix";
    # sops-nix.inputs.nixpkgs.follows = "nixpkgs";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };
  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.treefmt-nix.flakeModule ];

      systems = [ "x86_64-linux" ];

      perSystem = { config, pkgs, ... }: {
        formatter = config.treefmt.build.wrapper;

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [ bashInteractive nodejs_latest bun ];
        };

        treefmt = {
          projectRootFile = "flake.nix";
          programs = {
            nixfmt.enable = true;
            deadnix.enable = true;
            biome.enable = true;
            biome.formatUnsafe = true;
          };
          settings = { formatter = { biome.excludes = [ "lib/index.js" ]; }; };
        };
      };
    };
}
