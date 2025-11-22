class IArgFunction:
	def __init__(self, func):
		self.func = func

	def run(self, arg):
		return self.func(arg)

	def __call__(self, *args, **kwargs):
		return self.func(*args, **kwargs)

class inputManager:
	@classmethod
	def getInput(cls, inputType : type, prompt : str, validation : IArgFunction, terminalPrompt : str = None):
		if not( inputType == str or inputType == int or inputType == float ):
			return None
		
		ret = None
		valid = False

		while ( not valid ):
			try:
				print(prompt)

				ret = input(" >>> ")

				if ret == terminalPrompt:
					return None

				ret = inputType(ret)

				if (validation.run(ret)):
					valid = True
				else:
					print("Input invalid, try again.")
			
			except Exception:
				if inputType == int:
					print("Input must be a whole number, try again.")
				elif inputType == float:
					print("Input must be a number, try again.")

				else:
					print("Something went wrong, try again")
		
		return ret
	
	@classmethod
	def getInputs(cls, inputType : type, prompt : str, validation : IArgFunction, iterationPrompt : str, minInputs : int = 0, maxInputs : int = float('inf'), terminalPrompt : str = None):
		ret = []
		wantToFinish = False

		while not (wantToFinish and minInputs <= len(ret)) and len(ret) <= maxInputs:
			tep_ret = cls.getInput(inputType, prompt, validation, terminalPrompt)

			if tep_ret == None:
				if minInputs <= len(ret):
					wantToFinish = True
				else:
					print(f"Cannot finish yet, not enough values. You need {minInputs} to finish.")
					print(iterationPrompt.format(ret))
			else:
				ret.append(tep_ret)
				print(iterationPrompt.format(ret))
		
		if wantToFinish == False:
			print(f"Maximum inputs reached : {maxInputs}, finished")

		#print(f"Finished with values :{'\n > '.join(ret)}")

		return ret