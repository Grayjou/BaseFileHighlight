# This file should be HIGHLIGHTED (mint green by default)
# It only imports external packages

import numpy as np
import pandas as pd
import ast
import json
import sys
from datetime import datetime

def process_data():
    """Process data using only external libraries."""
    data = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]})
    result = np.mean(data['a'])
    timestamp = datetime.now()
    
    config = {
        'result': result,
        'timestamp': str(timestamp)
    }
    
    return json.dumps(config)

if __name__ == '__main__':
    print(process_data())
