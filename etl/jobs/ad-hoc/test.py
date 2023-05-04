import argparse

parser = argparse.ArgumentParser(description='tes job')

parser.add_argument('optional_arg', nargs='?', help='An optional integer positional argument')

arguments = parser.parse_args()

print(arguments.optional_arg)
